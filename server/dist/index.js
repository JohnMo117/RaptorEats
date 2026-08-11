"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const menu_1 = __importDefault(require("./routes/menu"));
const orders_1 = __importDefault(require("./routes/orders"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*', // For local prototype/Expo development
    methods: ['GET', 'POST', 'PATCH'] // Allow-list specific methods
}));
app.use(express_1.default.json({ limit: '1mb' })); // Limit body size to prevent DoS
// Global Rate Limiting
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/menu', menu_1.default);
app.use('/api/orders', orders_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
// Start Server on 0.0.0.0 to allow LAN access for the physical phone
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
