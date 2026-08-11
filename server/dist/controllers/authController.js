"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.loginSchema = exports.registerSchema = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().email(),
        password: zod_1.z.string()
            .min(8, "Password must be at least 8 characters long")
            .max(128, "Password must be at most 128 characters long"),
        role: zod_1.z.enum(['CUSTOMER', 'KITCHEN']).optional()
    })
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(1)
    })
});
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        // Hash password with bcrypt (memory-hard, secure salts included automatically)
        const saltRounds = 12;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role || 'CUSTOMER'
            }
        });
        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return generic error for security
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, auth_1.JWT_SECRET, { expiresIn: '7d' } // Secure expiration
        );
        res.status(200).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
