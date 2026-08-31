import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShipmentDocument = HydratedDocument<Shipment>;

export enum ShipmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Shipment {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  shipmentCode: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Customer',
  })
  customerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Warehouse',
  })
  warehouseId: Types.ObjectId;

  @Prop({
    type: Object,
  })
  sender: Record<string, unknown>;

  @Prop({
    type: Object,
  })
  receiver: Record<string, unknown>;

  @Prop({
    type: Object,
  })
  pickup: Record<string, unknown>;

  @Prop({
    type: Object,
  })
  delivery: Record<string, unknown>;

  @Prop({
    type: Object,
  })
  pricing: Record<string, unknown>;

  @Prop({
    equired: true,
    type: String,
    enum: Object.values(ShipmentStatus),
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
