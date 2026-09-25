import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDto } from './create-warehouse.dto';

export class UpdateWarehouseDto extends PartialType(
  OmitType(CreateWarehouseDto, ['status'] as const),
) {}
