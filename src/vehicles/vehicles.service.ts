import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vehicle, VehicleDocument, VehicleStatus } from './schemas/vehicle.schema';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { buildFilter } from 'src/common/helpers/filter.helper';
import { buildPagination, buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return await this.vehicleModel.create(createVehicleDto);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: VehicleStatus,
  ) {
    const filter = buildFilter({
          status,
          ...buildSearchFilter('vehicleCode', search),
        });
    
        const sort = buildSort(sortBy, sortOrder);
    
        const { skip } = buildPagination(page, limit);
    
        const [vehicle, total] = await Promise.all([
          this.vehicleModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(),
    
          this.vehicleModel.countDocuments(filter).exec(),
        ]);
    
        return {
          data: vehicle,
          meta: buildPaginationMeta(total, page, limit),
        };
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findById(id).exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    Object.assign(vehicle, updateVehicleDto);

    return await vehicle.save();
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel.findById(id).exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    await vehicle.deleteOne();

    return {
      message: 'Vehicle deleted successfully',
    };
  }
}
