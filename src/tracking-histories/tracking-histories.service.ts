import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    return await this.trackingHistoryModel.create(data);
  }

  async findByShipment(shipmentId: string) {
    return await this.trackingHistoryModel
      .find({ shipmentId })
      .sort({ createdAt: 1 })
      .exec();
  }
}