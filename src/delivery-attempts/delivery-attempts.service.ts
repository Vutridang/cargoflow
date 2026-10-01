import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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
import { ProofOfDeliveryDocument } from 'src/proof-of-delivery/schemas/proof-of-delivery.schema';
import { ProofOfDeliveriesService } from 'src/proof-of-delivery/proof-of-delivery.service';
import { buildFilter } from 'src/common/helpers/filter.helper';
import { buildPagination, buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class DeliveryAttemptsService {
  constructor(
    @InjectModel(DeliveryAttempt.name)
    private readonly deliveryAttemptModel: Model<DeliveryAttemptDocument>,

    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,

    @InjectModel(Shipment.name)
    private readonly proofOfDeliveryModel: Model<ProofOfDeliveryDocument>,

    private readonly proofOfDeliveryService: ProofOfDeliveriesService,
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

    const deliveryAttempt = new this.deliveryAttemptModel({
      ...createDeliveryAttemptDto,
      shipmentId: new Types.ObjectId(createDeliveryAttemptDto.shipmentId),
    });

    return await deliveryAttempt.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: DeliveryAttemptStatus,
  ) {
    const filter = buildFilter({
          status,
          ...buildSearchFilter('shipmentCode', search),
        });
    
        const sort = buildSort(sortBy, sortOrder);
    
        const { skip } = buildPagination(page, limit);
    
        const [deliveryAttempt, total] = await Promise.all([
          this.deliveryAttemptModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
    
          this.deliveryAttemptModel.countDocuments().exec(),
        ]);
    
        return {
          data: deliveryAttempt,
          meta: buildPaginationMeta(total, page, limit),
        };
  }

  async findByShipmentId(shipmentId: Types.ObjectId) {
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

    if (deliveryAttempt.status !== DeliveryAttemptStatus.DELIVERY) {
      throw new BadRequestException(
        `Cannot change delivery attempt status from ${deliveryAttempt.status}`,
      );
    }

    deliveryAttempt.status = status;

    const updatedDeliveryAttempt = await deliveryAttempt.save();

    // if (status === DeliveryAttemptStatus.SUCCESS) {
    //   await this.proofOfDeliveryModel.create({
    //     deliveryAttemptId: deliveryAttempt._id,
    //   });
    // }

    return updatedDeliveryAttempt;
  }

  async deleteByShipmentId(shipmentId: string) {
    if (!shipmentId) {
      throw new NotFoundException('Shipment not found');
    }

    const deliveryAttempts = await this.deliveryAttemptModel.find({
      shipmentId: new Types.ObjectId(shipmentId),
    });

    const deliveryAttemptId = deliveryAttempts.find(
      (attempt) => attempt.status === DeliveryAttemptStatus.SUCCESS,
    )?._id;

    if (deliveryAttemptId) {
      await this.proofOfDeliveryService.deleteByDeliveryAttempt(
        deliveryAttemptId,
      );
    }

    return await this.deliveryAttemptModel.deleteMany({
      shipmentId: new Types.ObjectId(shipmentId),
    });
  }

  // async deleteByShipmentId(shipmentId: Types.ObjectId) {
  //   if (!shipmentId) {
  //     throw new NotFoundException('Shipment not found');
  //   }

  //   const deliveryAttempts = await this.deliveryAttemptModel.find({
  //     shipmentId,
  //   });

  //   const deliveryAttemptId = deliveryAttempts.find(
  //     (attempt) => attempt.status === DeliveryAttemptStatus.SUCCESS,
  //   )?._id;

  //   if (deliveryAttemptId) {
  //     await this.proofOfDeliveryService.deleteByDeliveryAttempt(
  //       deliveryAttemptId,
  //     );
  //   }

  //   return await this.deliveryAttemptModel.deleteMany({
  //     shipmentId,
  //   });
  // }
}
