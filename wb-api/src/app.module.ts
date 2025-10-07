
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DealsModule } from './deals/deals.module';
import { FinanceModule } from './finance/finance.module';
import { GlossaryModule } from './glossary/glossary.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, DealsModule, FinanceModule, GlossaryModule, AuthModule],
})
export class AppModule {}
