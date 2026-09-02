import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

    const packageItem = new this.packageModel(createPackageDto);

    return await packageItem.save();
  }

  async findAll() {
    return await this.packageModel.find().exec();
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
