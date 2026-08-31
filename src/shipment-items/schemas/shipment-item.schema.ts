import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShipmentItemDocument = HydratedDocument<ShipmentItem>;

@Schema({ timestamps: true })
export class ShipmentItem {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Shipment',
  })
  shipmentId: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: String,
  })
  unit: string;

  @Prop({
    required: true,
    type: Number,
  })
  weight: number;

  @Prop({
    required: true,
    type: Number,
  })
  volume: number;
}

export const ShipmentItemSchema =
  SchemaFactory.createForClass(ShipmentItem);