import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';

import { DeliveryAttemptsService } from './delivery-attempts.service';

import { CreateDeliveryAttemptDto } from './dto/create-delivery-attempt.dto';
import { UpdateDeliveryAttemptStatusDto } from './dto/update-delivery-attempt-status.dto';

@Controller('delivery-attempts')
export class DeliveryAttemptsController {
  constructor(
    private readonly deliveryAttemptsService: DeliveryAttemptsService,
  ) {}

  @Post()
  create(@Body() createDeliveryAttemptDto: CreateDeliveryAttemptDto) {
    return this.deliveryAttemptsService.create(createDeliveryAttemptDto);
  }

  @Get()
  findAll() {
    return this.deliveryAttemptsService.findAll();
  }

  @Get('shipment/:shipmentId')
  findByShipmentId(@Param('shipmentId') shipmentId: string) {
    return this.deliveryAttemptsService.findByShipmentId(shipmentId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDeliveryAttemptStatusDto,
  ) {
    return this.deliveryAttemptsService.updateStatus(
      id,
      updateStatusDto.status,
    );
  }
}
