import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockLevelsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findLevel(
    productId: number,
    warehouseId: number,
  ) {
    return this.prisma.stockLevel.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });
  }

  async upsertLevel(
    productId: number,
    warehouseId: number,
    quantity: number,
  ) {
    return this.prisma.stockLevel.upsert({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },

      update: {
        quantity,
      },

      create: {
        productId,
        warehouseId,
        quantity,
      },
    });
  }
}