import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { UserRole } from 'src/user-roles/user-role.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,

    private jwtService: JwtService,
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

  async validateLogin(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'], 
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name.toLowerCase()),
    };

    const token = this.jwtService.sign(payload);

    return {
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: payload.roles,
      },
    };
  }
}
