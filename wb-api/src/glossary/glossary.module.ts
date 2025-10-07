
import { Module } from '@nestjs/common';
import { GlossaryController } from './glossary.controller';

@Module({
  controllers: [GlossaryController],
})
export class GlossaryModule {}
