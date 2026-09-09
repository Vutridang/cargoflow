import { Module } from '@nestjs/common';
import { TripShipmentsService } from './trip-shipments.service';
import { TripShipmentsController } from './trip-shipments.controller';
import { Shipment, ShipmentSchema } from 'src/shipments/schemas/shipment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from 'src/trips/schemas/trip.schema';
import { TripShipment, TripShipmentSchema } from './schemas/trip-shipment.schema';

@Module({
  imports: [
    // Register the Customer model so this module can interact with the customers collection.
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
      {
        name: Shipment.name,
        schema: ShipmentSchema,
      },
      {
        name: TripShipment.name,
        schema: TripShipmentSchema,
      },
    ]),
  ],
  controllers: [TripShipmentsController],
  providers: [TripShipmentsService],
})
export class TripShipmentsModule {}
