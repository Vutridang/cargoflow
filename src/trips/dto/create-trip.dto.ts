import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { TripStatus } from '../schemas/trip.schema';

export class CreateTripDto {
  @IsString()
  tripCode: string;

  @IsMongoId()
  vehicleId: string;

  @IsMongoId()
  driverId: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  scheduledDeparture: string;

  @IsDateString()
  @IsOptional()
  actualDeparture?: string;

  @IsDateString()
  scheduledArrival: string;

  @IsDateString()
  @IsOptional()
  actualArrival?: string;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}