import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Warehouse,
  WarehouseDocument,
  WareHouseStatus,
} from './schemas/warehouse.schema';

import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { buildFilter } from 'src/common/helpers/filter.helper';
import {
  buildPagination,
  buildPaginationMeta,
} from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';
import { UpdateWareHouseStatusDto } from './dto/update-warehouse-status.dto';

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

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: WareHouseStatus,
  ) {
    const filter = buildFilter({
      status,
      ...buildSearchFilter('warehouseCode', search),
    });

    const sort = buildSort(sortBy, sortOrder);

    const { skip } = buildPagination(page, limit);

    const [warehouse, total] = await Promise.all([
      this.warehouseModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),

      this.warehouseModel.countDocuments(filter).exec(),
    ]);

    return {
      data: warehouse,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string) {
    const warehouse = await this.warehouseModel.findById(id).exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
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

  async updateStatus(id: string, status: WareHouseStatus) {
    const wareHouse = await this.warehouseModel.findById(id).exec();

    if (!wareHouse) {
      throw new NotFoundException('Warehouse not found');
    }

    wareHouse.status = status;

    const updateWareHouseStatus = await wareHouse.save();

    // if (status === DeliveryAttemptStatus.SUCCESS) {
    //   await this.proofOfDeliveryModel.create({
    //     deliveryAttemptId: deliveryAttempt._id,
    //   });
    // }

    return updateWareHouseStatus;
  }

  async remove(id: string) {
    const warehouse = await this.warehouseModel.findByIdAndDelete(id).exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return {
      message: 'Warehouse deleted successfully',
    };
  }
}
