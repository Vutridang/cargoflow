import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  DeliveryAttempt,
  DeliveryAttemptDocument,
  DeliveryAttemptStatus,
} from './schemas/delivery-attempt.schema';

import {
  Shipment,
  ShipmentDocument,
  ShipmentStatus,
} from 'src/shipments/schemas/shipment.schema';

import { CreateDeliveryAttemptDto } from './dto/create-delivery-attempt.dto';

@Injectable()
export class DeliveryAttemptsService {
  constructor(
    @InjectModel(DeliveryAttempt.name)
    private readonly deliveryAttemptModel: Model<DeliveryAttemptDocument>,

    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createDeliveryAttemptDto: CreateDeliveryAttemptDto) {
    const shipment = await this.shipmentModel
      .findById(createDeliveryAttemptDto.shipmentId)
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    if (shipment.status !== ShipmentStatus.DELIVERED) {
      throw new BadRequestException(
        'Delivery attempt can only be created for delivered shipment',
      );
    }

    const deliveryAttempt = new this.deliveryAttemptModel(
      createDeliveryAttemptDto,
    );

    return await deliveryAttempt.save();
  }

  async findAll() {
    return await this.deliveryAttemptModel.find().exec();
  }

  async findByShipmentId(shipmentId: string) {
    const shipment = await this.shipmentModel.findById(shipmentId).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return await this.deliveryAttemptModel
      .find({ shipmentId })
      .sort({ attemptNumber: 1 })
      .exec();
  }

  async updateStatus(id: string, status: DeliveryAttemptStatus) {
    const deliveryAttempt = await this.deliveryAttemptModel.findById(id).exec();

    if (!deliveryAttempt) {
      throw new NotFoundException('Delivery attempt not found');
    }

    deliveryAttempt.status = status;

    return await deliveryAttempt.save();
  }
}
