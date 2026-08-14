import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    // Pass the validated request data to the service.
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    // Get all customers from the service.
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Get a customer by its MongoDB ObjectId.
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    // Pass the validated update data to the service.
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Delete a customer by its MongoDB ObjectId.
    return this.customersService.remove(id);
  }
}
