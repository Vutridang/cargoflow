import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  customerCode: string;

  @Prop({
    required: true,
    type: String,
  })
  companyName: string;

  @Prop({
    required: true,
    type: String,
  })
  contactName: string;

  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  email?: string;

  @Prop({
    type: String,
  })
  taxCode?: string;

  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @Prop({
    required: true,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
    type: String,
  })
  status: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);