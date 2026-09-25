import {IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @IsMongoId()
  @IsNotEmpty()
  roleId: string;
}
