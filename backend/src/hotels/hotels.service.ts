import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Hotel } from './hotel.entity';
import { User } from '../users/user.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getHotelsByManager(managerId: number) {
    return this.hotelRepo.find({
      where: { managerId },
      relations: ['group'],
      order: { GlobalPropertyName: 'ASC' },
    });
  }

  async getHotelsWithIdBelow100() {
    return this.hotelRepo.find({
      where: { GlobalPropertyID: LessThan(100) },
      relations: ['manager'],
    });
  }

  async assignManagerToHotel(hotelId: number, managerId: number | null) {

    if (!Number.isInteger(hotelId)) {
      throw new BadRequestException("Invalid hotel ID");
    }

    const hotel = await this.hotelRepo.findOneBy({ GlobalPropertyID: hotelId });
    if (!hotel) throw new NotFoundException("Hotel not found");

    if (managerId === null) {
      hotel.manager = null;
      hotel.managerId = null;
      return this.hotelRepo.save(hotel);
    }

    const manager = await this.userRepo.findOne({
      where: { id: managerId },
      relations: ['managerHotel'],
    });

    if (!manager) throw new NotFoundException("Manager not found");
    if (manager.managerHotel) {
      throw new BadRequestException("This manager is already assigned to a hotel");
    }

    hotel.manager = manager;
    hotel.managerId = manager.id;

    return this.hotelRepo.save(hotel);
  }


}
