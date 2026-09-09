import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTripShipmentDto } from './create-trip-shipment.dto';

export class UpdateTripShipmentDto extends PartialType(
  OmitType(CreateTripShipmentDto, ['tripId'] as const),
) {}
