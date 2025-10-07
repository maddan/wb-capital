
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
