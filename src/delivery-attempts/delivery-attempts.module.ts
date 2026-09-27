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
import { ProofOfDeliveriesModule } from 'src/proof-of-delivery/proof-of-delivery.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryAttempt.name, schema: DeliveryAttemptSchema },
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    ProofOfDeliveriesModule,
  ],
  controllers: [DeliveryAttemptsController],
  providers: [DeliveryAttemptsService],
})
export class DeliveryAttemptsModule {}
