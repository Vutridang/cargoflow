import { IsEnum, IsNotEmpty } from 'class-validator';
import { ShipmentStatus } from '../schemas/shipment.schema';

export class UpdateShipmentStatusDto {
  @IsEnum(ShipmentStatus)
  @IsNotEmpty()
  status: ShipmentStatus;
}