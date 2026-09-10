import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrackingHistoryDocument =
  HydratedDocument<TrackingHistory>;

@Schema({ timestamps: true })
export class TrackingHistory {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Shipment',
  })
  shipmentId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  status: string;

  @Prop({
    required: true,
    type: String,
  })
  location: string;

  @Prop({
    required: true,
    type: String,
  })
  trackingNote: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy: Types.ObjectId;
}

export const TrackingHistorySchema =
  SchemaFactory.createForClass(TrackingHistory);