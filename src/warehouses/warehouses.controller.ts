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

import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WareHouseStatus } from './schemas/warehouse.schema';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateWareHouseStatusDto } from './dto/update-warehouse-status.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
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
    enum: WareHouseStatus,
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: WareHouseStatus,
  ) {
    return this.warehousesService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
      sortBy || 'createdAt',
      sortOrder || 'desc',
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateWareHouseStatusDto: UpdateWareHouseStatusDto,
  ) {
    return this.warehousesService.updateStatus(
      id,
      updateWareHouseStatusDto.status,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
