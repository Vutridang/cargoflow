import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';

@Module({
    imports: [
         // Register the Shipment model so this module can interact with the shipment collection.
        MongooseModule.forFeature([
          {
            name: Shipment.name,
            schema: ShipmentSchema,
          },
        ]),
      ],
      controllers: [ShipmentsController],
      providers: [ShipmentsService],
})
export class ShipmentsModule {}
