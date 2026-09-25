import { Body, Controller, Param, Patch, Post, Get } from '@nestjs/common';

import { ProofOfDeliveriesService } from './proof-of-delivery.service';
import { CreateProofOfDeliveryDto } from './dto/create-proof-of-delivery.dto';
import { UpdateProofOfDeliveryDto } from './dto/update-proof-of-delivery.dto';

@Controller('proof-of-deliveries')
export class ProofOfDeliveriesController {
  constructor(
    private readonly proofOfDeliveriesService: ProofOfDeliveriesService,
  ) {}

  @Post(':deliveryAttemptId')
  create(
    @Param('deliveryAttemptId') deliveryAttemptId: string,
    @Body() createDto: CreateProofOfDeliveryDto,
  ) {
    return this.proofOfDeliveriesService.create(deliveryAttemptId, createDto);
  }

  @Get(':deliveryAttemptId')
  findOne(@Param('deliveryAttemptId') deliveryAttemptId: string) {
    return this.proofOfDeliveriesService.findByDeliveryAttemptId(deliveryAttemptId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProofOfDeliveryDto) {
    return this.proofOfDeliveriesService.update(id, updateDto);
  }
}
