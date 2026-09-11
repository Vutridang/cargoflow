import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

export enum SystemRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  DRIVER = 'DRIVER',
}

@Schema({ timestamps: true })
export class Role {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);