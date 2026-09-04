import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { DeliveryAttemptStatus } from '../schemas/delivery-attempt.schema';

export class CreateDeliveryAttemptDto {
  @IsMongoId()
  @IsNotEmpty()
  shipmentId: string;

  @IsNumber()
  @IsNotEmpty()
  attemptNumber: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsString()
  @IsOptional()
  receiverPhone?: string;

  @IsDateString()
  @IsNotEmpty()
  attemptedAt: string;

  @IsString()
  @IsOptional()
  note?: string;
}