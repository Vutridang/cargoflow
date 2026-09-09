import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TripDocument = HydratedDocument<Trip>;

export enum TripStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Trip {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  tripCode: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Vehicle',
  })
  vehicleId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Driver',
  })
  driverId: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  origin: string;

  @Prop({
    required: true,
    type: String,
  })
  destination: string;

  @Prop({
    required: true,
    type: Date,
  })
  scheduledDeparture: Date;

  @Prop({
    type: Date,
  })
  actualDeparture?: Date;

  @Prop({
    required: true,
    type: Date,
  })
  scheduledArrival: Date;

  @Prop({
    type: Date,
  })
  actualArrival?: Date;

  @Prop({
    required: true,
    type: String,
    enum: TripStatus,
    default: TripStatus.PLANNED,
  })
  status: TripStatus;
}

export const TripSchema = SchemaFactory.createForClass(Trip);