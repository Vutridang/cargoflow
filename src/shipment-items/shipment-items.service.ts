import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ShipmentItem,
  ShipmentItemDocument,
} from './schemas/shipment-item.schema';

import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import {
  Shipment,
  ShipmentDocument,
} from 'src/shipments/schemas/shipment.schema';
import { validateShipmentEditable } from 'src/common/helpers/shipment-status.helper';
import { Package, PackageDocument } from 'src/packages/schemas/package.schema';
import { buildFilter } from 'src/common/helpers/filter.helper';
import { buildPagination, buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class ShipmentItemsService {
  constructor(
    @InjectModel(ShipmentItem.name)
    private readonly shipmentItemModel: Model<ShipmentItemDocument>,
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
  ) {}

  async create(createShipmentItemDto: CreateShipmentItemDto) {
    const shipment = await this.shipmentModel
      .findById(createShipmentItemDto.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'add item');

    const shipmentItem = new this.shipmentItemModel({
      ...createShipmentItemDto,
      shipmentId: new Types.ObjectId(createShipmentItemDto.shipmentId),
    });

    return await shipmentItem.save();
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

    const [shipment_item, total] = await Promise.all([
      this.shipmentItemModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),

      this.shipmentItemModel.countDocuments().exec(),
    ]);

    return {
      data: shipment_item,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string) {
    const shipmentItem = await this.shipmentItemModel.findById(id).exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    return shipmentItem;
  }

  async update(id: string, updateShipmentItemDto: UpdateShipmentItemDto) {
    const shipmentItem = await this.shipmentItemModel
      .findByIdAndUpdate(id, updateShipmentItemDto, {
        new: true,
      })
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    const shipment = await this.shipmentModel
      .findById(shipmentItem.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'update item');

    return shipmentItem;
  }

  async remove(id: string) {
    const shipmentItem = await this.shipmentItemModel.findById(id).exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    const shipment = await this.shipmentModel
      .findById(shipmentItem.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'delete item');

    // Delete all packages belonging to this shipment item
    await this.packageModel.deleteMany({
      shipmentItemId: shipmentItem._id,
    });

    // Delete shipment item
    await shipmentItem.deleteOne();

    return {
      message: 'Shipment item and related packages deleted successfully',
    };
  }
}
