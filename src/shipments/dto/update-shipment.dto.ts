import { OmitType,PartialType } from '@nestjs/mapped-types';
import { CreateShipmentDto } from './create-shipment.dto';

// Make all remaining fields optional
export class UpdateShipmentDto extends PartialType(
  // Exclude shipmentCode from the update DTO
  OmitType(CreateShipmentDto, ['shipmentCode'] as const),
) {}