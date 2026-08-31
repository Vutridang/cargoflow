import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ShipmentItem,
  ShipmentItemDocument,
} from './schemas/shipment-item.schema';

import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';

@Injectable()
export class ShipmentItemsService {
  constructor(
    @InjectModel(ShipmentItem.name)
    private readonly shipmentItemModel: Model<ShipmentItemDocument>,
  ) {}

  async create(createShipmentItemDto: CreateShipmentItemDto) {
    const shipmentItem = new this.shipmentItemModel(
      createShipmentItemDto,
    );

    return await shipmentItem.save();
  }

  async findAll() {
    return await this.shipmentItemModel.find().exec();
  }

  async findOne(id: string) {
    const shipmentItem = await this.shipmentItemModel
      .findById(id)
      .exec();

    if (!shipmentItem) {
      throw new NotFoundException('Shipment item not found');
    }

    return shipmentItem;
  }

  async update(
    id: string,
    updateShipmentItemDto: UpdateShipmentItemDto,
  ) {
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