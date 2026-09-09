import { IsEnum } from 'class-validator';
import { TripStatus } from '../schemas/trip.schema';

export class UpdateTripStatusDto {
  @IsEnum(TripStatus)
  status: TripStatus;
}