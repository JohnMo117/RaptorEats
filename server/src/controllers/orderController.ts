import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive()
    })).min(1)
  })
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED'])
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/)
  })
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { items } = req.body;

    // We MUST calculate totals on the server to prevent price tampering
    let totalPrice = 0;
    let maxPrepTime = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        res.status(400).json({ error: `Product ID ${item.productId} not found` });
        return;
      }
      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;
      if (product.prepTime > maxPrepTime) maxPrepTime = product.prepTime;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        subtotal
      });
    }

    const estimatedWaitMinutes = maxPrepTime + 2; // base 2 min prep
    const estimatedReadyAt = new Date(Date.now() + estimatedWaitMinutes * 60000);

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'PENDING',
        estimatedReadyAt,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Emit event to all connected clients (Dashboard will listen to this)
    const io = req.app.get('io');
    if (io) {
      io.emit('orderCreated', newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id as unknown as string);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Emit event to notify clients (Mobile app and Dashboard)
    const io = req.app.get('io');
    if (io) {
      io.emit('orderUpdated', order);
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'PREPARING', 'READY']
        }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
