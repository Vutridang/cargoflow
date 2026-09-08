import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  vehicleCode: string;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsOptional()
  status?: string;
}