import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WarehouseType } from '@prisma/client';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(WarehouseType)
  type!: WarehouseType;

  @IsOptional()
  @IsString()
  description?: string;
}