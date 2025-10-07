"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.deal.create({
        data: {
            source: 'manual',
            title: 'Sky at Cullowhee - 58 Units',
            address: '563 N Country Club Dr',
            city: 'Cullowhee',
            state: 'NC',
            units: 58,
            price: 4640000,
            noi: 450115,
            capRate: 9.7,
        }
    });
    console.log('Seeded one example deal.');
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map