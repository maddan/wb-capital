
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('deals/:id')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Post('finance')
  compute(@Param('id') id: string, @Body() dto: any) {
    return this.finance.computeAndStore(id, dto);
  }

  @Get('metrics')
  metrics(@Param('id') id: string) { return this.finance.getMetrics(id); }
}
