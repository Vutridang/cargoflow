import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  TripShipment,
  TripShipmentDocument,
} from './schemas/trip-shipment.schema';

import { CreateTripShipmentDto } from './dto/create-trip-shipment.dto';
import { UpdateTripShipmentDto } from './dto/update-trip-shipment.dto';
import {
  Shipment,
  ShipmentDocument,
  ShipmentStatus,
} from 'src/shipments/schemas/shipment.schema';
import { Trip, TripDocument, TripStatus } from 'src/trips/schemas/trip.schema';

@Injectable()
export class TripShipmentsService {
  constructor(
    @InjectModel(TripShipment.name)
    private readonly tripShipmentModel: Model<TripShipmentDocument>,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createTripShipmentDto: CreateTripShipmentDto) {
    const { tripId, shipmentId } = createTripShipmentDto;

    // Check Trip
    const trip = await this.tripModel.findById(tripId).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Cannot create trip shipment when trip is not in progress',
      );
    }

    // Check Shipments
    const shipments = await this.shipmentModel
      .find({
        _id: { $in: shipmentId },
      })
      .exec();

    if (shipments.length !== shipmentId.length) {
      throw new NotFoundException('One or more shipments not found');
    }

    const invalidShipment = shipments.find(
      (shipment) => shipment.status !== ShipmentStatus.ASSIGNED,
    );

    if (invalidShipment) {
      throw new BadRequestException('All shipments must be assigned');
    }

    return await this.tripShipmentModel.create(createTripShipmentDto);
  }

  async findAll() {
    return await this.tripShipmentModel.find().exec();
  }

  async findOne(id: string) {
    const tripShipment = await this.tripShipmentModel.findById(id).exec();

    if (!tripShipment) {
      throw new NotFoundException('Trip shipment not found');
    }

    return tripShipment;
  }

  async update(id: string, updateTripShipmentDto: UpdateTripShipmentDto) {
    const tripShipment = await this.tripShipmentModel.findById(id).exec();

    if (!tripShipment) {
      throw new NotFoundException('Trip shipment not found');
    }

    if (updateTripShipmentDto.shipmentId) {
      const currentShipmentIds = tripShipment.shipmentId.map((id) =>
        id.toString(),
      );

      const newShipmentIds = updateTripShipmentDto.shipmentId.filter(
        (id) => !currentShipmentIds.includes(id),
      );

      if (newShipmentIds.length > 0) {
        const shipments = await this.shipmentModel
          .find({
            _id: { $in: newShipmentIds },
          })
          .exec();

        if (shipments.length !== newShipmentIds.length) {
          throw new NotFoundException('One or more shipments not found');
        }

        const invalidShipment = shipments.find(
          (shipment) => shipment.status !== ShipmentStatus.ASSIGNED,
        );

        if (invalidShipment) {
          throw new BadRequestException('All new shipments must be ASSIGNED');
        }
      }
    }

    Object.assign(tripShipment, updateTripShipmentDto);

    return await tripShipment.save();
  }

  async remove(id: string) {
    const tripShipment = await this.tripShipmentModel
      .findByIdAndDelete(id)
      .exec();

    if (!tripShipment) {
      throw new NotFoundException('Trip shipment not found');
    }

    return {
      message: 'Trip shipment deleted successfully',
    };
  }
}
