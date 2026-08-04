import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {

  constructor(
    private prisma: PrismaService,
  ) {}


  async create(dto: CreateProductDto) {

    const existing = await this.prisma.product.findUnique({
      where: {
        reference: dto.reference,
      },
    });


    if (existing) {
      throw new ConflictException(
        'Product reference already exists',
      );
    }


    return this.prisma.product.create({
      data: {
        reference: dto.reference,
        name: dto.name,
        minStock: dto.minStock,
        categoryId: dto.categoryId,
      },

      include: {
        category: true,
      },
    });

  }



  async findAll() {

    return this.prisma.product.findMany({

      include: {
        category: true,
      },

      orderBy: {
        id: 'asc',
      },

    });

  }



  async findOne(id: number) {

    const product =
      await this.prisma.product.findUnique({

        where: {
          id,
        },

        include: {
          category: true,
        },

      });


    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }


    return product;

  }



  async getStock(productId: number) {

    return this.prisma.stockLevel.findMany({

      where: {
        productId,
      },

      include: {
        warehouse: true,
      },

    });

  }



  async update(
    id: number,
    dto: UpdateProductDto,
  ) {

    await this.findOne(id);


    if (dto.reference) {

      const existing =
        await this.prisma.product.findUnique({

          where: {
            reference: dto.reference,
          },

        });


      if (existing && existing.id !== id) {

        throw new ConflictException(
          'Product reference already exists',
        );

      }

    }


    return this.prisma.product.update({

      where: {
        id,
      },

      data: dto,

      include: {
        category: true,
      },

    });

  }




  async remove(id: number) {

    await this.findOne(id);


    return this.prisma.product.delete({

      where: {
        id,
      },

    });

  }

}