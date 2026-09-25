import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  warehouseCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  status?: string;
}
