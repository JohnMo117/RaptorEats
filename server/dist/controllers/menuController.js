"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenu = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMenu = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true,
            },
        });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMenu = getMenu;
