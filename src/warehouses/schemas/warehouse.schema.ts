import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  warehouseCode: string;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @Prop({
    required: true,
    default: 'ACTIVE',
    type: String,
  })
  status: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);