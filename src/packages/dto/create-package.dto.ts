import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePackageDto {
  @IsMongoId()
  @IsNotEmpty()
  shipmentItemId: string;

  @IsString()
  @IsNotEmpty()
  packageCode: string;

  @IsString()
  @IsNotEmpty()
  packageType: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  length: number;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;
}