import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';

export class UpdateDriverDto extends PartialType(
  OmitType(CreateDriverDto, ['status'] as const),
) {}
