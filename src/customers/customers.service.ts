import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer, CustomerDocument } from './schemas/customer.schema';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    // Inject the Customer model so the service can interact with MongoDB.
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Create a new Customer document from the validated DTO.
    const customer = new this.customerModel(createCustomerDto);

    return customer.save();
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
      .findByIdAndUpdate(id, { status: 'INACTIVE' }, { new: true },)
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      message: 'Customer deactivated successfully',
    };
  }
}
