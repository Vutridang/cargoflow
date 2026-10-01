import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Package, PackageDocument } from './schemas/package.schema';

import {
  ShipmentItem,
  ShipmentItemDocument,
} from '../shipment-items/schemas/shipment-item.schema';

import {
  Shipment,
  ShipmentDocument,
  ShipmentStatus,
} from '../shipments/schemas/shipment.schema';

import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { validateShipmentEditable } from 'src/common/helpers/shipment-status.helper';
import { buildFilter } from 'src/common/helpers/filter.helper';
import { buildPagination, buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,

    @InjectModel(ShipmentItem.name)
    private readonly shipmentItemModel: Model<ShipmentItemDocument>,

    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    // Check shipment item
    const shipmentItem = await this.shipmentItemModel
      .findById(createPackageDto.shipmentItemId)
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    // Check shipment
    const shipment = await this.shipmentModel
      .findById(shipmentItem.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    // Check shipment status
    validateShipmentEditable(shipment.status, 'add package');

    const packageItem = new this.packageModel({
      ...createPackageDto,
      shipmentItemId: new Types.ObjectId(createPackageDto.shipmentItemId),
    });

    return await packageItem.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const filter = buildFilter({
      ...buildSearchFilter('name', search),
    });

    const sort = buildSort(sortBy, sortOrder);

    const { skip } = buildPagination(page, limit);

    const [package_item, total] = await Promise.all([
      this.packageModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),

      this.packageModel.countDocuments().exec(),
    ]);

    return {
      data: package_item,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string) {
    const packageItem = await this.packageModel.findById(id).exec();

    if (!packageItem) {
      throw new NotFoundException('Package not found');
    }

    return packageItem;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const packageItem = await this.packageModel.findById(id).exec();

    if (!packageItem) {
      throw new NotFoundException('Package not found');
    }

    // Check shipment item
    const shipmentItem = await this.shipmentItemModel
      .findById(packageItem.shipmentItemId)
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    // Check shipment
    const shipment = await this.shipmentModel
      .findById(shipmentItem.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    // Check shipment status
    validateShipmentEditable(shipment.status, 'update package');

    Object.assign(packageItem, updatePackageDto);

    return await packageItem.save();
  }

  async remove(id: string) {
    const packageItem = await this.packageModel.findById(id).exec();

    if (!packageItem) {
      throw new NotFoundException('Package not found');
    }

    // Check shipment item
    const shipmentItem = await this.shipmentItemModel
      .findById(packageItem.shipmentItemId)
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    // Check shipment
    const shipment = await this.shipmentModel
      .findById(shipmentItem.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    // Check shipment status
    validateShipmentEditable(shipment.status, 'delete package');

    await packageItem.deleteOne();

    return {
      message: 'Package deleted successfully',
    };
  }
}
