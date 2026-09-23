import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';

import {
  TrackingHistory,
  TrackingHistoryDocument,
} from './schemas/tracking-history.schema';

@Injectable()
export class TrackingHistoriesService {
  constructor(
    @InjectModel(TrackingHistory.name)
    private readonly trackingHistoryModel: Model<TrackingHistoryDocument>,
  ) {}

  async create(data: Partial<TrackingHistory>) {
    const trackingHistory = await this.trackingHistoryModel.create(data);

    console.log('SAVED TRACKING HISTORY:', trackingHistory);

    return trackingHistory;
  }

  async findByShipment(shipmentId: string) {
    return await this.trackingHistoryModel
      .find({ shipmentId: new Types.ObjectId(shipmentId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async deleteByShipment(shipmentId: Types.ObjectId) {
    return await this.trackingHistoryModel.deleteMany({
      shipmentId,
    });
  }
}
