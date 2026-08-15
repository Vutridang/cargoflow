import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Role',
  })
  roleId: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
    type: Boolean,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);