import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsPositive,
} from 'class-validator';

import { StockMovementType } from '@prisma/client';


export class CreateStockMovementDto {

  @IsOptional()
@IsEnum(StockMovementType)
type?: StockMovementType;


  @IsInt()
  @IsPositive()
  quantity!: number;


  @IsInt()
  productId!: number;


  @IsInt()
  warehouseId!: number;


  @IsOptional()
  @IsInt()
  locationId?: number;


  @IsOptional()
  @IsString()
  reference?: string;

}