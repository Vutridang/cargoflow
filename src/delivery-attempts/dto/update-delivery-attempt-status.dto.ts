import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeliveryAttemptStatus } from '../schemas/delivery-attempt.schema';

export class UpdateDeliveryAttemptStatusDto {
  @IsEnum(DeliveryAttemptStatus)
  @IsNotEmpty()
  status: DeliveryAttemptStatus;
}