import { IsEnum, IsNotEmpty } from 'class-validator';
import { DriverStatus } from '../schemas/driver.schema';


export class UpdateDriverStatusDto {
  @IsEnum(DriverStatus)
  @IsNotEmpty()
  status: DriverStatus;
}
