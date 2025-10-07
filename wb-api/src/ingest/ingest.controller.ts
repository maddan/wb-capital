import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  // POST /ingest/bulk  (or /api/v1/ingest/bulk if you set a global prefix)
  @Post('bulk')
  async bulk(@Body() body: any) {
    const { city, state, items } = body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return { inserted: 0, updated: 0, skipped: 0, total: 0 };
    }
    return this.ingest.bulkUpsert({ city, state, items });
  }
}
