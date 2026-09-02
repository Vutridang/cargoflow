import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';

import { Package, PackageSchema } from './schemas/package.schema';

import { Shipment, ShipmentSchema } from '../shipments/schemas/shipment.schema';
import { ShipmentItem, ShipmentItemSchema } from 'src/shipment-items/schemas/shipment-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Package.name,
        schema: PackageSchema,
      },
      {
        name: ShipmentItem.name,
        schema: ShipmentItemSchema,
      },
      {
        name: Shipment.name,
        schema: ShipmentSchema,
      },
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
