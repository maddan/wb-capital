import { IngestService } from './ingest.service';
export declare class IngestController {
    private readonly ingest;
    constructor(ingest: IngestService);
    bulk(body: any): Promise<{
        inserted: number;
        updated: number;
        skipped: number;
        total: number;
    }>;
}
