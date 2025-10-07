
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, QueryDealsDto } from './dto';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDealDto) {
    return this.prisma.deal.create({ data: dto as any });
  }

  findAll(q: QueryDealsDto) {
    const where: any = {};
    if (q.city) where.city = q.city;
    if (q.state) where.state = q.state;
    if (q.minCap) where.capRate = { gte: Number(q.minCap) };
    if (q.maxPrice) where.price = { lte: Number(q.maxPrice) };
    if (q.minUnits) where.units = { gte: Number(q.minUnits) };
    return this.prisma.deal.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      include: { finance: true },
      take: 200,
    });
  }

  findOne(id: string) {
    return this.prisma.deal.findUnique({ where: { id }, include: { finance: true } });
  }
}
