import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly finance;
    constructor(finance: FinanceService);
    compute(id: string, dto: any): Promise<{
        id: string;
        dealId: string;
        interestRate: number;
        ltv: number;
        termYears: number;
        annualDebtSvc: number;
        dscr: number;
        cashFlowYr1: number;
    }>;
    metrics(id: string): import(".prisma/client").Prisma.Prisma__FinanceClient<{
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
