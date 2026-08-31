import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ShipmentItemsService } from './shipment-items.service';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';

@Controller('shipment-items')
export class ShipmentItemsController {
  constructor(
    private readonly shipmentItemsService: ShipmentItemsService,
  ) {}

  @Post()
  create(@Body() createShipmentItemDto: CreateShipmentItemDto) {
    return this.shipmentItemsService.create(
      createShipmentItemDto,
    );
  }

  @Get()
  findAll() {
    return this.shipmentItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipmentItemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShipmentItemDto: UpdateShipmentItemDto,
  ) {
    return this.shipmentItemsService.update(
      id,
      updateShipmentItemDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipmentItemsService.remove(id);
  }
}