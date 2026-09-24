import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Customer, CustomerDocument } from './schemas/customer.schema';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class CustomersService {
  constructor(
    // Inject the Customer model so the service can interact with MongoDB.
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const user = await this.userModel.findById(createCustomerDto.userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const customer = new this.customerModel({
      ...createCustomerDto,
      userId: new Types.ObjectId(user._id),
      contactName: user.fullName,
      email: user.email,
      phone: user.phone,
    });

    return await customer.save();
  }

  async findAll() {
    return this.customerModel.find().exec();
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id).exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async remove(id: string) {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, { status: 'INACTIVE' }, { new: true })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      message: 'Customer deactivated successfully',
    };
  }
}
