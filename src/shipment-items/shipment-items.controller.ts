import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ShipmentItemsService } from './shipment-items.service';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('shipment-items')
export class ShipmentItemsController {
  constructor(private readonly shipmentItemsService: ShipmentItemsService) {}

  @Post()
  create(@Body() createShipmentItemDto: CreateShipmentItemDto) {
    return this.shipmentItemsService.create(createShipmentItemDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.shipmentItemsService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
      sortBy || 'createdAt',
      sortOrder || 'desc',
    );
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
    return this.shipmentItemsService.update(id, updateShipmentItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipmentItemsService.remove(id);
  }
}
