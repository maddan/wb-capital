import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Item = {
  source: string;
  externalId?: string;
  title: string;
  address: string;
  price: number;
  noi?: number;
  capRate?: number;
  units?: number;
  sqft?: number;
};

@Injectable()
export class IngestService {
  constructor(private prisma: PrismaService) {}

  async bulkUpsert({ city, state, items }: { city?: string; state?: string; items: Item[] }) {
    let inserted = 0, updated = 0, skipped = 0;

    for (const raw of items) {
      const rec: any = {
        source: raw.source || 'manual',
        externalId: raw.externalId ?? null,
        title: raw.title,
        address: raw.address,
        city: city || 'Unknown',
        state: state || 'NA',
        units: raw.units ?? null,
        sqft: raw.sqft ?? null,
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
          } else {
            await this.prisma.deal.create({ data: rec });
            inserted++;
          }
        } else {
          await this.prisma.deal.create({ data: rec });
          inserted++;
        }
      } catch {
        skipped++;
      }
    }

    return { inserted, updated, skipped, total: items.length };
  }
}
