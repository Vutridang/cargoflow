import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TripShipmentDocument =
  HydratedDocument<TripShipment>;

@Schema({ timestamps: true })
export class TripShipment {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Trip',
  })
  tripId: Types.ObjectId;

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: 'Shipment',
  })
  shipmentId: Types.ObjectId[];

  @Prop({
    type: Number,
  })
  sequence?: number;

  @Prop({
    type: Date,
  })
  loadedAt?: Date;

  @Prop({
    type: Date,
  })
  unloadedAt?: Date;
}

export const TripShipmentSchema =
  SchemaFactory.createForClass(TripShipment);