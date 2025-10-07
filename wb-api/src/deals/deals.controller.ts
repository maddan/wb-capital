
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto, QueryDealsDto } from './dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Post()
  create(@Body() dto: CreateDealDto) { return this.deals.create(dto); }

  @Get()
  findAll(@Query() q: QueryDealsDto) { return this.deals.findAll(q); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.deals.findOne(id); }
}
