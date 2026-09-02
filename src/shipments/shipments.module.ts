import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import {
  Customer,
  CustomerSchema,
} from 'src/customers/schemas/customer.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Warehouse,
  WarehouseSchema,
} from 'src/warehouses/schemas/warehouse.schema';
import { Package, PackageSchema } from 'src/packages/schemas/package.schema';
import { ShipmentItem, ShipmentItemSchema } from 'src/shipment-items/schemas/shipment-item.schema';

@Module({
  imports: [
    // Register the Shipment model so this module can interact with the shipment collection.
    MongooseModule.forFeature([
      {
        name: Shipment.name,
        schema: ShipmentSchema,
      },
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Warehouse.name,
        schema: WarehouseSchema,
      },
      { name: ShipmentItem.name, schema: ShipmentItemSchema },
      { name: Package.name, schema: PackageSchema },
    ]),
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
})
export class ShipmentsModule {}
