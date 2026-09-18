import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  action: string;

  @Prop({
    required: true,
  })
  resource: string;

  @Prop({
    required: true,
  })
  resourceId: string;

  @Prop({
    type: Object,
  })
  oldData?: Record<string, any>;

  @Prop({
    type: Object,
  })
  newData?: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
