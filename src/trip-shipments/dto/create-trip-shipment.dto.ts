import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTripShipmentDto {
  @IsMongoId({ each: true })
  tripId: string;

  @IsArray()
  @IsMongoId({ each: true })
  shipmentId: string[];

  @IsNumber()
  @IsOptional()
  sequence?: number;

  @IsDateString()
  @IsOptional()
  loadedAt?: string;

  @IsDateString()
  @IsOptional()
  unloadedAt?: string;
}