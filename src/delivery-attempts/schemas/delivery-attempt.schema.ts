import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeliveryAttemptDocument = HydratedDocument<DeliveryAttempt>;

export enum DeliveryAttemptStatus {
  DELIVERY = 'DELIVERY',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class DeliveryAttempt {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Shipment',
  })
  shipmentId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  attemptNumber: number;

  @Prop({
    required: true,
    type: String,
    enum: DeliveryAttemptStatus,
    default: DeliveryAttemptStatus.DELIVERY,
  })
  status: DeliveryAttemptStatus;

  @Prop({ type: String })
  reason?: string;

  @Prop({ type: String })
  receiverName?: string;

  @Prop({ type: String })
  receiverPhone?: string;

  @Prop({ required: true, type: Date })
  attemptedAt: Date;

  @Prop({ type: String })
  note?: string;
}

export const DeliveryAttemptSchema =
  SchemaFactory.createForClass(DeliveryAttempt);