import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { UserRole } from 'src/user-roles/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password, roleId } = dto;

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      return { errorEmail: 'Email already in use' };
    }

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      return { errorRole: 'Invalid role selected' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    const userRole = this.userRoleRepo.create({
      user,
      role,
    });

    await this.userRoleRepo.save(userRole);
    return { message: 'User registered successfully' };
  }
}
