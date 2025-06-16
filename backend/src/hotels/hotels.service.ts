import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

    async getHotelsByManager(managerId: number) {
    return this.hotelRepo.find({
        where: { managerId },
        relations: ['group'],
        order: { GlobalPropertyName: 'ASC' },
    });
    }
}
