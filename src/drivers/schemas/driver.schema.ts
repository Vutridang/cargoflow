import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DriverDocument = HydratedDocument<Driver>;

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Driver {
  @Prop({ required: true, type: String, unique: true })
  driverCode: string;

  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String, unique: true })
  licenseNumber: string;

  @Prop({ required: true, type: String })
  licenseType: string;

  @Prop({ required: true, type: Date })
  licenseExpiryDate: Date;

  @Prop({
    required: true,
    type: String,
    enum: DriverStatus,
    default: DriverStatus.ACTIVE,
  })
  status: DriverStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);