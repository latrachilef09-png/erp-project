import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryProductDto extends PaginationDto {

  @IsOptional()
  @IsString()
  search?: string;
}