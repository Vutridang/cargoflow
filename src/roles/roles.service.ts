import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';

const systemRoles = ['ADMIN', 'CUSTOMER', 'DRIVER', 'OPERATOR'];

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    if (systemRoles.includes(createRoleDto.name.toUpperCase())) {
      throw new BadRequestException(
        `System role ${createRoleDto.name} already exists`,
      );
    }

    const existingRole = await this.roleModel
      .findOne({ name: createRoleDto.name })
      .exec();

    if (existingRole) {
      throw new BadRequestException(
        `Role ${createRoleDto.name} already exists`,
      );
    }

    return await this.roleModel.create(createRoleDto);
  }

  async findAll() {
    return await this.roleModel.find().exec();
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check system role
    if (updateRoleDto.name && systemRoles.includes(updateRoleDto.name)) {
      throw new BadRequestException(
        `Cannot use system role name ${updateRoleDto.name}`,
      );
    }

    Object.assign(role, updateRoleDto);

    return await role.save();
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (systemRoles.includes(role.name)) {
      throw new BadRequestException(`Cannot delete system role ${role.name}`);
    }

    await role.deleteOne();

    return {
      message: 'Role deleted successfully',
    };
  }
}
