
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function monthlyDebtPayment(principal: number, ratePct: number, years: number) {
  const r = (ratePct / 100) / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async computeAndStore(dealId: string, dto: { interestRate: number; ltv: number; termYears: number; }) {
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal || deal.price == null) throw new Error('Deal not found or missing price');
    const loan = deal.price * (dto.ltv / 100);
    const monthly = monthlyDebtPayment(loan, dto.interestRate, dto.termYears);
    const annualDebtSvc = monthly * 12;
    const dscr = deal.noi ? deal.noi / annualDebtSvc : null;
    const cashFlowYr1 = deal.noi ? deal.noi - annualDebtSvc : null;
    const finance = await this.prisma.finance.upsert({
      where: { dealId },
      create: {
        dealId,
        interestRate: dto.interestRate,
        ltv: dto.ltv,
        termYears: dto.termYears,
        annualDebtSvc,
        dscr: dscr ?? 0,
        cashFlowYr1: cashFlowYr1 ?? 0,
      },
      update: {
        interestRate: dto.interestRate,
        ltv: dto.ltv,
        termYears: dto.termYears,
        annualDebtSvc,
        dscr: dscr ?? 0,
        cashFlowYr1: cashFlowYr1 ?? 0,
      }
    });
    return finance;
  }

  getMetrics(dealId: string) {
    return this.prisma.finance.findUnique({ where: { dealId } });
  }
}
