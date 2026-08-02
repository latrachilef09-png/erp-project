import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { StockMovementsService } from './stock-movements.service';

import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Query } from '@nestjs/common';
import { QueryStockMovementDto } from './dto/query-stock-movement.dto';

@Controller('stock-movements')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockMovementsController {

  constructor(
    private readonly stockMovementsService: StockMovementsService,
  ) {}



  @Post()
  @Roles('ADMIN', 'STOCK_MANAGER')
  create(
    @Body() createStockMovementDto: CreateStockMovementDto,
  ) {

    return this.stockMovementsService.create(
      createStockMovementDto,
    );

  }



  @Get()
@Roles('ADMIN', 'STOCK_MANAGER', 'VIEWER')
findAll(
  @Query() query: QueryStockMovementDto,
) {
  return this.stockMovementsService.findAll(query);
}

}