import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, QueryDealsDto } from './dto';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateDealDto): import(".prisma/client").Prisma.Prisma__DealClient<{
        source: string;
        externalId: string | null;
        title: string;
        address: string;
        city: string;
        state: string;
        units: number | null;
        sqft: number | null;
        price: number;
        noi: number | null;
        capRate: number | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(q: QueryDealsDto): import(".prisma/client").Prisma.PrismaPromise<({
        finance: {
            id: string;
            dealId: string;
            interestRate: number;
            ltv: number;
            termYears: number;
            annualDebtSvc: number;
            dscr: number;
            cashFlowYr1: number;
        } | null;
    } & {
        source: string;
        externalId: string | null;
        title: string;
        address: string;
        city: string;
        state: string;
        units: number | null;
        sqft: number | null;
        price: number;
        noi: number | null;
        capRate: number | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__DealClient<({
        finance: {
            id: string;
            dealId: string;
            interestRate: number;
            ltv: number;
            termYears: number;
            annualDebtSvc: number;
            dscr: number;
            cashFlowYr1: number;
        } | null;
    } & {
        source: string;
        externalId: string | null;
        title: string;
        address: string;
        city: string;
        state: string;
        units: number | null;
        sqft: number | null;
        price: number;
        noi: number | null;
        capRate: number | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
