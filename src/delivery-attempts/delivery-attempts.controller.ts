import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { DeliveryAttemptsService } from './delivery-attempts.service';

import { CreateDeliveryAttemptDto } from './dto/create-delivery-attempt.dto';
import { UpdateDeliveryAttemptStatusDto } from './dto/update-delivery-attempt-status.dto';
import { Types } from 'mongoose';
import { ApiQuery } from '@nestjs/swagger';
import { DeliveryAttemptStatus } from './schemas/delivery-attempt.schema';

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
  @ApiQuery({
    name: 'status',
    required: false,
    enum: DeliveryAttemptStatus,
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: DeliveryAttemptStatus,
  ) {
    return this.deliveryAttemptsService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
      sortBy || 'createdAt',
      sortOrder || 'desc',
      status,
    );
  }

  @Get('shipment/:shipmentId')
  findByShipmentId(@Param('shipmentId') shipmentId: string) {
    return this.deliveryAttemptsService.findByShipmentId(
      new Types.ObjectId(shipmentId),
    );
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

  @Delete('shipment/:shipmentId')
  deleteByShipmentId(@Param('shipmentId') shipmentId: string) {
    return this.deliveryAttemptsService.deleteByShipmentId(shipmentId);
  }

  // @Delete('shipment/:shipmentId')
  // deleteByShipmentId(@Param('shipmentId') shipmentId: string) {
  //   return this.deliveryAttemptsService.deleteByShipmentId(
  //     //shipmentId,
  //     new Types.ObjectId(shipmentId)
  //   );
  // }
}
