import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  shipmentCode: string;

  @IsMongoId()
  @IsNotEmpty()
  customerId: string;

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsMongoId()
  @IsNotEmpty()
  warehouseId: string;

  @IsObject()
  @IsNotEmpty()
  sender: Record<string, unknown>;

  @IsObject()
  @IsNotEmpty()
  receiver: Record<string, unknown>;

  @IsObject()
  @IsNotEmpty()
  pickup: Record<string, unknown>;

  @IsObject()
  @IsNotEmpty()
  delivery: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pricing?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  status?: string;
}