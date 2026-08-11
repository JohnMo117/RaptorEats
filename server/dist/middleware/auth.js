"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = exports.JWT_SECRET = void 0;
exports.getJwtSecret = getJwtSecret;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// Multi-tiered secure fallback as per securecoder_generation guidelines
function getJwtSecret() {
    if (process.env.JWT_SECRET_KEY) {
        return process.env.JWT_SECRET_KEY;
    }
    const secretPath = path_1.default.join(__dirname, '../../jwt_secret.txt');
    if (fs_1.default.existsSync(secretPath)) {
        return fs_1.default.readFileSync(secretPath, 'utf-8').trim();
    }
    console.warn("Generating ephemeral secret. Instance-isolated!");
    const ephemeralSecret = crypto_1.default.randomBytes(32).toString('hex');
    // Optionally, save it so it survives server restarts locally
    try {
        fs_1.default.writeFileSync(secretPath, ephemeralSecret);
    }
    catch (e) {
        console.error('Failed to save ephemeral secret:', e);
    }
    return ephemeralSecret;
}
exports.JWT_SECRET = getJwtSecret();
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ error: 'Forbidden: Insufficient role' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
