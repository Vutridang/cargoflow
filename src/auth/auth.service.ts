import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    // 1. Check email already exists
    const existingUser = await this.userModel.findOne({
      email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Find default CUSTOMER role
    const customerRole = await this.roleModel.findOne({
      name: 'CUSTOMER',
    });

    if (!customerRole) {
      throw new NotFoundException('CUSTOMER role not found');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. Create user
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      roleId: customerRole._id,
    });

    // 5. Return safe user information
    return {
      message: 'Register successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email,
        phone: user.phone,
        roleId: user.roleId,
      },
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // 1. Find user by email
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Check account status
    if (user.isActive !== true) {
      throw new ForbiddenException('Account is inactive');
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. Generate JWT payload
    const payload = {
      sub: user._id.toString(),
      roleId: user.roleId.toString(),
    };

    // 5. Generate access token
    const accessToken = await this.jwtService.signAsync(payload);

    // 6. Return response
    return {
      message: 'Login successfully',
      data: {
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          roleId: user.roleId,
        },
      },
    };
  }
}
