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
exports.IngestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IngestService = class IngestService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bulkUpsert({ city, state, items }) {
        var _a, _b, _c;
        let inserted = 0, updated = 0, skipped = 0;
        for (const raw of items) {
            const rec = {
                source: raw.source || 'manual',
                externalId: (_a = raw.externalId) !== null && _a !== void 0 ? _a : null,
                title: raw.title,
                address: raw.address,
                city: city || 'Unknown',
                state: state || 'NA',
                units: (_b = raw.units) !== null && _b !== void 0 ? _b : null,
                sqft: (_c = raw.sqft) !== null && _c !== void 0 ? _c : null,
                price: Number(raw.price || 0),
                noi: raw.noi != null ? Number(raw.noi) : null,
                capRate: raw.capRate != null ? Number(raw.capRate) : null,
            };
            try {
                if (rec.externalId) {
                    const existing = await this.prisma.deal.findFirst({
                        where: { source: rec.source, externalId: rec.externalId },
                    });
                    if (existing) {
                        await this.prisma.deal.update({ where: { id: existing.id }, data: rec });
                        updated++;
                    }
                    else {
                        await this.prisma.deal.create({ data: rec });
                        inserted++;
                    }
                }
                else {
                    await this.prisma.deal.create({ data: rec });
                    inserted++;
                }
            }
            catch {
                skipped++;
            }
        }
        return { inserted, updated, skipped, total: items.length };
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IngestService);
//# sourceMappingURL=ingest.service.js.map