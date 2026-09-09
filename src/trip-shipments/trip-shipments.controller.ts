import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TripShipmentsService } from './trip-shipments.service';
import { CreateTripShipmentDto } from './dto/create-trip-shipment.dto';
import { UpdateTripShipmentDto } from './dto/update-trip-shipment.dto';

@Controller('trip-shipments')
export class TripShipmentsController {
  constructor(
    private readonly tripShipmentsService: TripShipmentsService,
  ) {}

  @Post()
  create(
    @Body()
    createTripShipmentDto: CreateTripShipmentDto,
  ) {
    return this.tripShipmentsService.create(
      createTripShipmentDto,
    );
  }

  @Get()
  findAll() {
    return this.tripShipmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripShipmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTripShipmentDto: UpdateTripShipmentDto,
  ) {
    return this.tripShipmentsService.update(
      id,
      updateTripShipmentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripShipmentsService.remove(id);
  }
}