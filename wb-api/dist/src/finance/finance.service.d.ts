import { PrismaService } from '../prisma/prisma.service';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    computeAndStore(dealId: string, dto: {
        interestRate: number;
        ltv: number;
        termYears: number;
    }): Promise<{
        id: string;
        dealId: string;
        interestRate: number;
        ltv: number;
        termYears: number;
        annualDebtSvc: number;
        dscr: number;
        cashFlowYr1: number;
    }>;
    getMetrics(dealId: string): import(".prisma/client").Prisma.Prisma__FinanceClient<{
        id: string;
        dealId: string;
        interestRate: number;
        ltv: number;
        termYears: number;
        annualDebtSvc: number;
        dscr: number;
        cashFlowYr1: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
