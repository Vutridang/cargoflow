import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TrackingHistory,
  TrackingHistorySchema,
} from './schemas/tracking-history.schema';

import { TrackingHistoriesService } from './tracking-histories.service';
import { TrackingHistoriesController } from './tracking-histories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrackingHistory.name,
        schema: TrackingHistorySchema,
      },
    ]),
  ],
  controllers: [TrackingHistoriesController],
  providers: [TrackingHistoriesService],
  exports: [TrackingHistoriesService],
})
export class TrackingHistoriesModule {}