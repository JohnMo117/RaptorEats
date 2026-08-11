"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getMyOrders = exports.createOrder = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.number().int().positive(),
            quantity: zod_1.z.number().int().positive()
        })).min(1)
    })
});
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED'])
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/)
    })
});
const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
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
            if (product.prepTime > maxPrepTime)
                maxPrepTime = product.prepTime;
            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                subtotal
            });
        }
        const estimatedWaitMinutes = maxPrepTime + 2; // base 2 min prep
        const estimatedReadyAt = new Date(Date.now() + estimatedWaitMinutes * 60000);
        const order = await prisma.order.create({
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
                items: true
            }
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMyOrders = getMyOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        res.status(200).json(order);
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
