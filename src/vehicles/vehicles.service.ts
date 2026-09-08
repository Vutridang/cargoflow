import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Vehicle,
  VehicleDocument,
} from './schemas/vehicle.schema';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return await this.vehicleModel.create(createVehicleDto);
  }

  async findAll() {
    return await this.vehicleModel.find().exec();
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel
      .findById(id)
      .exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ) {
    const vehicle = await this.vehicleModel
      .findById(id)
      .exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    Object.assign(vehicle, updateVehicleDto);

    return await vehicle.save();
  }

  async remove(id: string) {
    const vehicle = await this.vehicleModel
      .findById(id)
      .exec();

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    await vehicle.deleteOne();

    return {
      message: 'Vehicle deleted successfully',
    };
  }
}