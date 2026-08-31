import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShipmentItemsController } from './shipment-items.controller';
import { ShipmentItemsService } from './shipment-items.service';
import {
  ShipmentItem,
  ShipmentItemSchema,
} from './schemas/shipment-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ShipmentItem.name,
        schema: ShipmentItemSchema,
      },
    ]),
  ],
  controllers: [ShipmentItemsController],
  providers: [ShipmentItemsService],
})
export class ShipmentItemsModule {}