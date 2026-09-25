import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Driver, DriverDocument, DriverStatus } from './schemas/driver.schema';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { buildFilter } from 'src/common/helpers/filter.helper';
import { buildPagination, buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    return await this.driverModel.create({
      ...createDriverDto,
      licenseExpiryDate: new Date(createDriverDto.licenseExpiryDate),
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: DriverStatus,
  ) {
    const filter = buildFilter({
              status,
              ...buildSearchFilter('driverCode', search),
            });
        
            const sort = buildSort(sortBy, sortOrder);
        
            const { skip } = buildPagination(page, limit);
        
            const [driver, total] = await Promise.all([
              this.driverModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
        
              this.driverModel.countDocuments(filter).exec(),
            ]);
        
            return {
              data: driver,
              meta: buildPaginationMeta(total, page, limit),
            };
  }

  async findOne(id: string) {
    const driver = await this.driverModel.findById(id).exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverModel.findById(id).exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    Object.assign(driver, updateDriverDto);

    if (updateDriverDto.licenseExpiryDate) {
      driver.licenseExpiryDate = new Date(updateDriverDto.licenseExpiryDate);
    }

    return await driver.save();
  }

  async remove(id: string) {
    const driver = await this.driverModel.findById(id).exec();

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    await driver.deleteOne();

    return {
      message: 'Driver deleted successfully',
    };
  }
}
