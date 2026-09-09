import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';

export class UpdateTripDto extends PartialType(
  // Exclude shipmentCode from the update DTO
  OmitType(CreateTripDto, ['tripCode','status'] as const),
) {}