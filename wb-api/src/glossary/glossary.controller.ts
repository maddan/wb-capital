
import { Controller, Get, Param } from '@nestjs/common';

const MAP: Record<string, string> = {
  dscr: "DSCR shows how easily a property’s income covers the mortgage. 1.60 means a 60% cushion.",
  noi: "NOI is rent and other income minus operating expenses (before loan payments).",
  cap_rate: "Cap rate is NOI divided by price — a quick yield measure.",
  debt_cost: "Debt cost is the interest rate and terms we pay to the lender for the loan.",
  ltv: "LTV is the loan-to-value percentage. 75% LTV means 25% down payment."
};

@Controller('glossary')
export class GlossaryController {
  @Get(':key')
  get(@Param('key') key: string) {
    const text = MAP[key.toLowerCase()] ?? 'Not found';
    return { key, text };
  }
}
