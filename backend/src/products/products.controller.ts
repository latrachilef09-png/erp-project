import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STOCK_MANAGER', 'VIEWER')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}


  @Post()
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }


  @Get()
  findAll() {
    return this.productsService.findAll();
  }


  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.productsService.findOne(Number(id));
  }


  @Get(':id/stock')
  getStock(
    @Param('id') id: string,
  ) {
    return this.productsService.getStock(Number(id));
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(Number(id), dto);
  }


  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.productsService.remove(Number(id));
  }

}