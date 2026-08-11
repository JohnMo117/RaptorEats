import { Router } from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getAllOrders, createOrderSchema, updateOrderStatusSchema } from '../controllers/orderController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Only authenticated users can create orders and view their own
router.post('/', requireAuth, validate(createOrderSchema), createOrder);
router.get('/me', requireAuth, getMyOrders);

// Only kitchen staff can view all orders and update status
router.get('/', requireAuth, requireRole('KITCHEN'), getAllOrders);
router.patch('/:id/status', requireAuth, requireRole('KITCHEN'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
