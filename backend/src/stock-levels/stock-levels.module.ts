import { Module } from '@nestjs/common';

import { StockLevelsService } from './stock-levels.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StockLevelsService],
  exports: [StockLevelsService],
})
export class StockLevelsModule {}