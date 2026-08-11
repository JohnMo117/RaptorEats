"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// Only authenticated users can create orders and view their own
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(orderController_1.createOrderSchema), orderController_1.createOrder);
router.get('/me', auth_1.requireAuth, orderController_1.getMyOrders);
// Only kitchen staff can update order status
router.patch('/:id/status', auth_1.requireAuth, (0, auth_1.requireRole)('KITCHEN'), (0, validate_1.validate)(orderController_1.updateOrderStatusSchema), orderController_1.updateOrderStatus);
exports.default = router;
