import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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
import {
  ShipmentItem,
  ShipmentItemDocument,
} from 'src/shipment-items/schemas/shipment-item.schema';

import { TrackingHistoriesService } from 'src/tracking-histories/tracking-histories.service';
import { buildTrackingInfo } from 'src/common/helpers/tracking-history.helper';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { buildAuditLog } from 'src/common/helpers/audit-log.helper';
import {
  buildPagination,
  buildPaginationMeta,
} from 'src/common/helpers/pagination.helper';
import { buildSearchFilter } from 'src/common/helpers/search.helper';
import { buildSort } from 'src/common/helpers/sort.helper';
import { buildFilter } from 'src/common/helpers/filter.helper';

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

    private readonly trackingHistoriesService: TrackingHistoriesService,

    private readonly auditLogsService: AuditLogsService,
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

    [ShipmentStatus.DELIVERED]: [],

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

    const shipment = new this.shipmentModel({
      ...createShipmentDto,
      customerId: new Types.ObjectId(createShipmentDto.customerId),
      warehouseId: new Types.ObjectId(createShipmentDto.warehouseId),
      createdBy: new Types.ObjectId(createShipmentDto.createdBy),
    });

    // const { location, trackingNote } = buildTrackingInfo(
    //   shipment,
    //   shipment.status,
    // );

    // await this.trackingHistoriesService.create({
    //   shipmentId: shipment._id,
    //   userId: shipment.createdBy,
    //   status: shipment.status,
    //   location,
    //   trackingNote,
    //   updatedBy: shipment.createdBy,
    // });

    await this.auditLogsService.create(
      buildAuditLog(
        user._id,
        'CREATE',
        'SHIPMENT',
        shipment._id,
        undefined,
        shipment.toObject(),
      ),
    );

    return await shipment.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: ShipmentStatus,
  ) {
    const filter = buildFilter({
      status,
      ...buildSearchFilter('shipmentCode', search),
    });

    const sort = buildSort(sortBy, sortOrder);

    const { skip } = buildPagination(page, limit);

    const [shipments, total] = await Promise.all([
      this.shipmentModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),

      this.shipmentModel.countDocuments().exec(),
    ]);

    return {
      data: shipments,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'update item');

    const oldData = shipment.toObject();

    Object.assign(shipment, updateShipmentDto);

    const savedShipment = await shipment.save();

    const user = await this.userModel.findById(shipment.createdBy).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.auditLogsService.create(
      buildAuditLog(
        user._id,
        'UPDATE',
        'SHIPMENT',
        shipment._id,
        oldData,
        savedShipment.toObject(),
      ),
    );

    return savedShipment;
  }

  async updateStatus(id: string, status: ShipmentStatus) {
    const shipment = await this.shipmentModel
      .findById(id)
      .populate('warehouseId')
      .exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const warehouseName = (shipment.warehouseId as any).name;

    const allowedStatuses = this.allowedTransitions[shipment.status];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Cannot change shipment status from ${shipment.status} to ${status}`,
      );
    }

    const oldData = {
      status: shipment.status,
    };

    shipment.status = status;

    const savedShipment = await shipment.save();

    const { location, trackingNote } = buildTrackingInfo(
      shipment,
      status,
      warehouseName,
    );

    await this.trackingHistoriesService.create({
      shipmentId: shipment._id,
      userId: shipment.createdBy,
      status,
      location,
      trackingNote,
      updatedBy: shipment.createdBy,
    });

    const user = await this.userModel.findById(shipment.createdBy).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.auditLogsService.create(
      buildAuditLog(
        user._id,
        'UPDATE_STATUS',
        'SHIPMENT',
        shipment._id,
        oldData,
        {
          status: savedShipment.status,
        },
      ),
    );

    return savedShipment;
  }

  async remove(id: string) {
    const shipment = await this.shipmentModel.findById(id).exec();

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    validateShipmentEditable(shipment.status, 'delete item');

    const user = await this.userModel.findById(shipment.createdBy).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    // Delete all tracking histories
    await this.trackingHistoriesService.deleteByShipment(
      shipment._id.toString(),
    );

    // Create audit log before deleting shipment
    await this.auditLogsService.create(
      buildAuditLog(
        user._id,
        'DELETE',
        'SHIPMENT',
        shipment._id,
        shipment.toObject(),
        undefined,
      ),
    );

    // Delete shipment
    await shipment.deleteOne();

    return {
      message: 'Shipment and related items and packages deleted successfully',
    };
  }
}
