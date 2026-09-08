import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Driver,
  DriverDocument,
} from './schemas/driver.schema';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    return await this.driverModel.create({
      ...createDriverDto,
      licenseExpiryDate: new Date(
        createDriverDto.licenseExpiryDate,
      ),
    });
  }

  async findAll() {
    return await this.driverModel.find().exec();
  }

  async findOne(id: string) {
    const driver = await this.driverModel
      .findById(id)
      .exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(
    id: string,
    updateDriverDto: UpdateDriverDto,
  ) {
    const driver = await this.driverModel
      .findById(id)
      .exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    Object.assign(driver, updateDriverDto);

    if (updateDriverDto.licenseExpiryDate) {
      driver.licenseExpiryDate = new Date(
        updateDriverDto.licenseExpiryDate,
      );
    }

    return await driver.save();
  }

  async remove(id: string) {
    const driver = await this.driverModel
      .findById(id)
      .exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    await driver.deleteOne();

    return {
      message: 'Driver deleted successfully',
    };
  }
}