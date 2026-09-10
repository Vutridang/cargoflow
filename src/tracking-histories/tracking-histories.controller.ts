import { Controller, Get, Param } from '@nestjs/common';

import { TrackingHistoriesService } from './tracking-histories.service';

@Controller('tracking-histories')
export class TrackingHistoriesController {
  constructor(
    private readonly trackingHistoriesService: TrackingHistoriesService,
  ) {}

  @Get('shipment/:shipmentId')
  findByShipment(@Param('shipmentId') shipmentId: string) {
    return this.trackingHistoriesService.findByShipment(shipmentId);
  }
}