import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, Like, ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUsers(search: string, page: number) {
    const PAGE_SIZE = 10;

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
      relations: ['userRoles','userRoles.role'],
    });
  }
}
