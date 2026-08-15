import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

// Make all remaining fields optional
export class UpdateCustomerDto extends PartialType(
  // Exclude customerCode from the update DTO
  OmitType(CreateCustomerDto, ['customerCode'] as const),
) {}