import { IsEnum, IsNotEmpty } from 'class-validator';
import { VehicleStatus } from '../schemas/vehicle.schema';

export class UpdateVehicleStatusDto {
  @IsEnum(VehicleStatus)
  @IsNotEmpty()
  status: VehicleStatus;
}
