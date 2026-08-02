import {
  Injectable,
  NotFoundException,
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


    return this.prisma.stockMovement.create({
  data: createStockMovementDto,
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