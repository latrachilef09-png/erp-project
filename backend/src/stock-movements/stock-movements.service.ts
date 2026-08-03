import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { QueryStockMovementDto } from './dto/query-stock-movement.dto';

@Injectable()
export class StockMovementsService {

  constructor(
    private prisma: PrismaService,
  ) {}


  async create(
    createStockMovementDto: CreateStockMovementDto,
  ) {

    const {
      productId,
      warehouseId,
      locationId,
    } = createStockMovementDto;


    // Check product exists
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });


    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }


    // Check warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: {
        id: warehouseId,
      },
    });


    if (!warehouse) {
      throw new NotFoundException(
        'Warehouse not found',
      );
    }



    // Check location belongs to warehouse
    if (locationId) {

      const location =
        await this.prisma.location.findFirst({
          where: {
            id: locationId,
            warehouseId,
          },
        });


      if (!location) {
        throw new NotFoundException(
          'Location not found in this warehouse',
        );
      }
    }


    return this.prisma.$transaction(async (tx) => {

  const currentLevel =
    await tx.stockLevel.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

  let currentQuantity =
    currentLevel?.quantity ?? 0;

  let newQuantity = currentQuantity;

  switch (createStockMovementDto.type) {

    case 'IN':
      newQuantity += createStockMovementDto.quantity;
      break;

    case 'OUT':
      newQuantity -= createStockMovementDto.quantity;
      break;

    case 'ADJUSTMENT':
      newQuantity = createStockMovementDto.quantity;
      break;

    case 'TRANSFER':
      newQuantity -= createStockMovementDto.quantity;
      break;
  }

  if (newQuantity < 0) {
  throw new BadRequestException(
    'Insufficient stock',
  );
}

  await tx.stockLevel.upsert({

    where: {
      productId_warehouseId: {
        productId,
        warehouseId,
      },
    },

    update: {
      quantity: newQuantity,
    },

    create: {
      productId,
      warehouseId,
      quantity: newQuantity,
    },

  });

  return tx.stockMovement.create({
    data: createStockMovementDto,
  });

});
  }




  async findAll(query: QueryStockMovementDto) {

  const {
    productId,
    warehouseId,
    locationId,
  } = query;

  return this.prisma.stockMovement.findMany({

    where: {
      ...(productId && { productId }),
      ...(warehouseId && { warehouseId }),
      ...(locationId && { locationId }),
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      product: true,
      warehouse: true,
      location: true,
    },

  });

}}