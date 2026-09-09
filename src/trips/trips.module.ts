import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip, TripSchema } from './schemas/trip.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Register the Customer model so this module can interact with the customers collection.
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
    ]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
