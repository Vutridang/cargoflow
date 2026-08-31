import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { UsersModule } from './users/users.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ShipmentItemsModule } from './shipment-items/shipment-items.module';

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
  ],
})
export class AppModule {}
