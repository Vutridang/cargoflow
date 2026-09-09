import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument, TripStatus } from './schemas/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
  ) {}

  async create(createTripDto: CreateTripDto) {
    return await this.tripModel.create(createTripDto);
  }

  async findAll() {
    return await this.tripModel.find().exec();
  }

  async findOne(id: string) {
    const trip = await this.tripModel.findById(id).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    const trip = await this.tripModel
      .findByIdAndUpdate(id, updateTripDto, {
        new: true,
      })
      .exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async updateStatus(id: string, status: TripStatus) {
    const trip = await this.tripModel.findById(id).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const allowedTransitions: Record<TripStatus, TripStatus[]> = {
      [TripStatus.PLANNED]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED],
      [TripStatus.IN_PROGRESS]: [TripStatus.COMPLETED],
      [TripStatus.COMPLETED]: [],
      [TripStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[trip.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change trip status from ${trip.status} to ${status}`,
      );
    }

    trip.status = status;

    return await trip.save();
  }

  async remove(id: string) {
    const trip = await this.tripModel.findByIdAndDelete(id).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return {
      message: 'Trip deleted successfully',
    };
  }
}
