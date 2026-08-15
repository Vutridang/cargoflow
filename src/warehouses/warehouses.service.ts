import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Warehouse,
  WarehouseDocument,
} from './schemas/warehouse.schema';

import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const warehouse = new this.warehouseModel(createWarehouseDto);

    return await warehouse.save();
  }

  async findAll() {
    return await this.warehouseModel.find().exec();
  }

  async findOne(id: string) {
    const warehouse = await this.warehouseModel.findById(id).exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const warehouse = await this.warehouseModel
      .findByIdAndUpdate(id, updateWarehouseDto, {
        new: true,
      })
      .exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async remove(id: string) {
    const warehouse = await this.warehouseModel
      .findByIdAndDelete(id)
      .exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return {
      message: 'Warehouse deleted successfully',
    };
  }
}