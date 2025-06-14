import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
 constructor(
     @InjectRepository(Role)
     private readonly roleRepo: Repository<Role>,
   ) {}

  async getAll() {
    return this.roleRepo.find();
  }
}
