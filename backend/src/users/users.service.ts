import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { UserRole } from '../user-roles/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async getUsers(search: string, page: number) {
    const PAGE_SIZE = 4;
    const whereClause = search ? { name: ILike(`%${search}%`) } : {};

    const [users, total] = await this.userRepo.findAndCount({
      where: whereClause,
      relations: ['userRoles', 'userRoles.role'],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      order: { id: 'ASC' },
    });

    return {
      users,
      hasMore: page * PAGE_SIZE < total,
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    roleIds: number[];
  }) {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    for (const roleId of data.roleIds) {
      const role = await this.roleRepo.findOneBy({ id: roleId });
      if (role) {
        const userRole = this.userRoleRepo.create({ user, role });
        await this.userRoleRepo.save(userRole);
      }
    }

    return { message: 'User created successfully' };
  }

  async updateUser(id: number, data: {
    name: string;
    email: string;
    password?: string;
    roles: number[];
  }) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['userRoles'] });
    if (!user) {
      throw new Error('User not found');
    }

    user.name = data.name;
    user.email = data.email;

    if (data.password && data.password.trim() !== '') {
      user.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepo.save(user);

    await this.userRoleRepo.delete({ user: { id } });

    for (const roleId of data.roles) {
      const role = await this.roleRepo.findOneBy({ id: roleId });
      if (role) {
        const userRole = this.userRoleRepo.create({ user, role });
        await this.userRoleRepo.save(userRole);
      }
    }

    return { message: 'User updated successfully' };
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['managedGroup'], // verificăm dacă are hotel group
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.managedGroup) {
      throw new BadRequestException(
        'Cannot delete user: is assigned as manager to a hotel group.'
      );
    }

    await this.userRepo.delete(id);

    return { message: 'User deleted successfully' };
  }

  async getUsersByRole(roleName: string) {

    if (!roleName || typeof roleName !== "string") {
      throw new BadRequestException("Role name is required and must be a string.");
    }

    const users = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userRoles", "userRole")
      .leftJoinAndSelect("userRole.role", "role")
      .where("LOWER(role.name) = LOWER(:roleName)", { roleName }) 
      .select(["user.id", "user.name"])
      .getMany();

    return users;
  }

}
