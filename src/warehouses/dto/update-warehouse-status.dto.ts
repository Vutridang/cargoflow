import { IsEnum, IsNotEmpty } from 'class-validator';
import { WareHouseStatus } from '../schemas/warehouse.schema';

export class UpdateWareHouseStatusDto {
  @IsEnum(WareHouseStatus)
  @IsNotEmpty()
  status: WareHouseStatus;
}