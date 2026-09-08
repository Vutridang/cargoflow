import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProofOfDeliveriesController } from './proof-of-delivery.controller';
import { ProofOfDeliveriesService } from './proof-of-delivery.service';

import {
  ProofOfDelivery,
  ProofOfDeliverySchema,
} from './schemas/proof-of-delivery.schema';
import { DeliveryAttempt, DeliveryAttemptSchema } from 'src/delivery-attempts/schemas/delivery-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProofOfDelivery.name,
        schema: ProofOfDeliverySchema,
      },
      {
        name: DeliveryAttempt.name,
        schema: DeliveryAttemptSchema,
      },
    ]),
  ],
  controllers: [ProofOfDeliveriesController],
  providers: [ProofOfDeliveriesService],
})
export class ProofOfDeliveriesModule {}