import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryAttemptsController } from './delivery-attempts.controller';
import { DeliveryAttemptsService } from './delivery-attempts.service';

import {
  DeliveryAttempt,
  DeliveryAttemptSchema,
} from './schemas/delivery-attempt.schema';

import {
  Shipment,
  ShipmentSchema,
} from 'src/shipments/schemas/shipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryAttempt.name, schema: DeliveryAttemptSchema },
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
  ],
  controllers: [DeliveryAttemptsController],
  providers: [DeliveryAttemptsService],
})
export class DeliveryAttemptsModule {}