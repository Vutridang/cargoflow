import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProofOfDeliveryDocument = HydratedDocument<ProofOfDelivery>;

@Schema({ timestamps: true })
export class ProofOfDelivery {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'DeliveryAttempt',
    unique: true,
  })
  deliveryAttemptId: Types.ObjectId;

  @Prop({ required: true, type: String })
  receiverName: string;

  @Prop({ type: String })
  signatureUrl?: string;

  @Prop({ type: [String], default: [] })
  photoUrls: string[];

  @Prop({ required: true, type: Date })
  deliveredAt: Date;

  @Prop({ type: String })
  note?: string;
}

export const ProofOfDeliverySchema =
  SchemaFactory.createForClass(ProofOfDelivery);