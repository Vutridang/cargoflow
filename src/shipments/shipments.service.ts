import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Shipment,
  ShipmentDocument,
  ShipmentStatus,
} from './schemas/shipment.schema';

import {
  Customer,
  CustomerDocument,
} from '../customers/schemas/customer.schema';

import { User, UserDocument } from '../users/schemas/user.schema';

import {
  Warehouse,
  WarehouseDocument,
} from '../warehouses/schemas/warehouse.schema';

import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,

    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async create(createShipmentDto: CreateShipmentDto) {
    const customer = await this.customerModel
      .findById(createShipmentDto.customerId)
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.status !== 'ACTIVE') {
      throw new BadRequestException('Inactive customer cannot create shipment');
    }

    const user = await this.userModel
      .findById(createShipmentDto.createdBy)
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const warehouse = await this.warehouseModel
      .findById(createShipmentDto.warehouseId)
      .exec();

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

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

  async updateStatus(id: string, status: ShipmentStatus) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    shipment.status = status;

    return await shipment.save();
  }

  async remove(id: string) {
    const shipment = await this.shipmentModel.findByIdAndDelete(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return {
      message: 'Shipment deleted successfully',
    };
  }
}
