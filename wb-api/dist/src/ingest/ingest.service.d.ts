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
export declare class IngestService {
    private prisma;
    constructor(prisma: PrismaService);
    bulkUpsert({ city, state, items }: {
        city?: string;
        state?: string;
        items: Item[];
    }): Promise<{
        inserted: number;
        updated: number;
        skipped: number;
        total: number;
    }>;
}
export {};
