import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, type: String, unique: true })
  vehicleCode: string;

  @Prop({ required: true, type: String, unique: true })
  plateNumber: string;

  @Prop({ required: true, type: String })
  vehicleType: string;

  @Prop({ required: true, type: Number })
  capacity: number;

  @Prop({
    required: true,
    type: String,
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);