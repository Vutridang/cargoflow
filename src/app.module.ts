import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { UsersModule } from './users/users.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ShipmentItemsModule } from './shipment-items/shipment-items.module';
import { PackagesModule } from './packages/packages.module';
import { DeliveryAttemptsModule } from './delivery-attempts/delivery-attempts.module';
import { ProofOfDeliveriesModule } from './proof-of-delivery/proof-of-delivery.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { TripsModule } from './trips/trips.module';
import { TripShipmentsModule } from './trip-shipments/trip-shipments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Make configuration variables available throughout the application
      // without importing ConfigModule in every feature module.
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI as string),

    CustomersModule,

    ShipmentsModule,

    UsersModule,

    WarehousesModule,

    ShipmentItemsModule,

    PackagesModule,

    DeliveryAttemptsModule,

    ProofOfDeliveriesModule,

    VehiclesModule,

    DriversModule,

    TripsModule,

    TripShipmentsModule
  ],
})
export class AppModule {}
