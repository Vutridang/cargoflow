import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Shipment,
  ShipmentDocument,
} from './schemas/shipment.schema';

import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createShipmentDto: CreateShipmentDto) {
    const shipment = new this.shipmentModel(createShipmentDto);

    return await shipment.save();
  }

  async findAll() {
    return await this.shipmentModel.find().exec();
  }

  async findOne(id: string) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.shipmentModel
      .findByIdAndUpdate(id, updateShipmentDto, {
        new: true,
      })
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async remove(id: string) {
    const shipment = await this.shipmentModel
      .findByIdAndDelete(id)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return {
      message: 'Shipment deleted successfully',
    };
  }
}