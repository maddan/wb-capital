"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DealsService = class DealsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.deal.create({ data: dto });
    }
    findAll(q) {
        const where = {};
        if (q.city)
            where.city = q.city;
        if (q.state)
            where.state = q.state;
        if (q.minCap)
            where.capRate = { gte: Number(q.minCap) };
        if (q.maxPrice)
            where.price = { lte: Number(q.maxPrice) };
        if (q.minUnits)
            where.units = { gte: Number(q.minUnits) };
        return this.prisma.deal.findMany({
            where,
            orderBy: [{ createdAt: 'desc' }],
            include: { finance: true },
            take: 200,
        });
    }
    findOne(id) {
        return this.prisma.deal.findUnique({ where: { id }, include: { finance: true } });
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DealsService);
//# sourceMappingURL=deals.service.js.map