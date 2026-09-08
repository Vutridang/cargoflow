import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProofOfDelivery,
  ProofOfDeliveryDocument,
} from './schemas/proof-of-delivery.schema';

import { CreateProofOfDeliveryDto } from './dto/create-proof-of-delivery.dto';
import { UpdateProofOfDeliveryDto } from './dto/update-proof-of-delivery.dto';
import {
  DeliveryAttempt,
  DeliveryAttemptDocument,
  DeliveryAttemptStatus,
} from 'src/delivery-attempts/schemas/delivery-attempt.schema';

@Injectable()
export class ProofOfDeliveriesService {
  constructor(
    @InjectModel(ProofOfDelivery.name)
    private readonly proofOfDeliveryModel: Model<ProofOfDeliveryDocument>,
    @InjectModel(DeliveryAttempt.name)
    private readonly deliveryAttemptModel: Model<DeliveryAttemptDocument>,
  ) {}

  async create(deliveryAttemptId: string, createProodOfDeliveryDto: CreateProofOfDeliveryDto) {
    const deliveryAttempt = await this.deliveryAttemptModel
      .findById(deliveryAttemptId)
      .exec();

    if (!deliveryAttempt) {
      throw new NotFoundException('Delivery attempt not found');
    }

    if (deliveryAttempt.status !== DeliveryAttemptStatus.SUCCESS) {
      throw new BadRequestException(
        'Cannot create proof of delivery when delivery attempt is not successful',
      );
    }

    const deliveredAt = new Date();

    // Update DeliveryAttempt
    deliveryAttempt.updatedAt = deliveredAt;

    await deliveryAttempt.save();

    // Create ProofOfDelivery
    return await this.proofOfDeliveryModel.create({
      deliveryAttemptId: deliveryAttempt._id,

      receiverName: deliveryAttempt.receiverName,

      note: deliveryAttempt.note,

      signatureUrl: createProodOfDeliveryDto.signatureUrl
        ? `${deliveryAttemptId}_${createProodOfDeliveryDto.signatureUrl}`
        : undefined,

      photoUrls: createProodOfDeliveryDto.photoUrls?.map(
        (photo, index) => `${deliveryAttemptId}_${photo}`,
      ),
      deliveredAt,
    });
  }

  async update(id: string, updateProodOfDeliveryDto: UpdateProofOfDeliveryDto) {
    const proofOfDelivery = await this.proofOfDeliveryModel.findById(id).exec();

    if (!proofOfDelivery) {
      throw new NotFoundException('Proof of delivery not found');
    }

    const deliveryAttemptId = proofOfDelivery.deliveryAttemptId.toString();

    if (updateProodOfDeliveryDto.signatureUrl) {
      proofOfDelivery.signatureUrl = `${deliveryAttemptId}_${updateProodOfDeliveryDto.signatureUrl}`;
    }

    if (updateProodOfDeliveryDto.photoUrls) {
      proofOfDelivery.photoUrls = updateProodOfDeliveryDto.photoUrls.map(
        (photo) => `${deliveryAttemptId}_${photo}`,
      );
    }

    return await proofOfDelivery.save();
  }
}
