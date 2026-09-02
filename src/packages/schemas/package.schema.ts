import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'ShipmentItem',
  })
  shipmentItemId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  packageCode: string;

  @Prop({
    required: true,
    type: String,
  })
  packageType: string;

  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: Number,
  })
  weight: number;

  @Prop({
    required: true,
    type: Number,
  })
  length: number;

  @Prop({
    required: true,
    type: Number,
  })
  width: number;

  @Prop({
    required: true,
    type: Number,
  })
  height: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);