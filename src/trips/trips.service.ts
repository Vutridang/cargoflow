import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument, TripStatus } from './schemas/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { buildFilter } from 'src/common/helpers/filter.helper';
import {
  buildPagination,
  buildPaginationMeta,
} from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
  ) {}

  async create(createTripDto: CreateTripDto) {
    return await this.tripModel.create({
      ...createTripDto,
      vehicleId: new Types.ObjectId(createTripDto.vehicleId),
      driverId: new Types.ObjectId(createTripDto.driverId),
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: TripStatus,
  ) {
    const filter = buildFilter({
      status,
      ...buildSearchFilter('tripCode', search),
    });

    const sort = buildSort(sortBy, sortOrder);

    const { skip } = buildPagination(page, limit);

    const [trip, total] = await Promise.all([
      this.tripModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),

      this.tripModel.countDocuments().exec(),
    ]);

    return {
      data: trip,
      meta: buildPaginationMeta(total, page, limit),
    };
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
