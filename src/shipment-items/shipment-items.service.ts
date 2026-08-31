import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ShipmentItem,
  ShipmentItemDocument,
} from './schemas/shipment-item.schema';

import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import {
  Shipment,
  ShipmentDocument,
  ShipmentStatus,
} from 'src/shipments/schemas/shipment.schema';

@Injectable()
export class ShipmentItemsService {
  constructor(
    @InjectModel(ShipmentItem.name)
    private readonly shipmentItemModel: Model<ShipmentItemDocument>,
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createShipmentItemDto: CreateShipmentItemDto) {
    const shipment = await this.shipmentModel
      .findById(createShipmentItemDto.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const allowedStatuses = [ShipmentStatus.PENDING, ShipmentStatus.CONFIRMED];

    if (!allowedStatuses.includes(shipment.status)) {
      throw new BadRequestException(
        `Cannot add item to shipment with status ${shipment.status}`,
      );
    }

    const shipmentItem = new this.shipmentItemModel(createShipmentItemDto);

    return await shipmentItem.save();
  }

  async findAll() {
    return await this.shipmentItemModel.find().exec();
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

    return shipmentItem;
  }

  async remove(id: string) {
    const shipmentItem = await this.shipmentItemModel
      .findByIdAndDelete(id)
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    return {
      message: 'Shipment item deleted successfully',
    };
  }
}
