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
import { validateShipmentEditable } from 'src/common/helpers/shipment-status.helper';
import { Package, PackageDocument } from 'src/packages/schemas/package.schema';
import { ShipmentItem, ShipmentItemDocument } from 'src/shipment-items/schemas/shipment-item.schema';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,

    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(ShipmentItem.name)
    private readonly shipmentItemModel: Model<ShipmentItemDocument>,

    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,

    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    [ShipmentStatus.PENDING]: [
      ShipmentStatus.CONFIRMED,
      ShipmentStatus.CANCELLED,
    ],

    [ShipmentStatus.CONFIRMED]: [
      ShipmentStatus.ASSIGNED,
      ShipmentStatus.CANCELLED,
    ],

    [ShipmentStatus.ASSIGNED]: [ShipmentStatus.IN_TRANSIT],

    [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED],

    [ShipmentStatus.DELIVERED]: [ShipmentStatus.CANCELLED],

    [ShipmentStatus.CANCELLED]: [],
  };

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

    validateShipmentEditable(shipment.status, 'update item');

    return shipment;
  }

  async updateStatus(id: string, status: ShipmentStatus) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const allowedStatuses = this.allowedTransitions[shipment.status];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Cannot change shipment status from ${shipment.status} to ${status}`,
      );
    }

    shipment.status = status;

    return await shipment.save();
  }

  async remove(id: string) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'delete item');

    // Find all shipment items belonging to this shipment
    const shipmentItems = await this.shipmentItemModel
      .find({ shipmentId: shipment._id.toString() })
      .select('_id')
      .exec();

    const shipmentItemIds = shipmentItems.map((item) => item._id.toString());

    // Delete all packages belonging to those shipment items
    if (shipmentItemIds.length > 0) {
      await this.packageModel.deleteMany({
        shipmentItemId: { $in: shipmentItemIds },
      });
    }

    // Delete all shipment items
    await this.shipmentItemModel.deleteMany({
      shipmentId: shipment._id.toString(),
    });

    // Delete shipment
    await shipment.deleteOne();

    return {
      message: 'Shipment and related items and packages deleted successfully',
    };
  }
}
