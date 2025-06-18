import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    const hotels = await this.hotelRepo.find({
      where: { managerId },
      relations: ['group'],
      order: { GlobalPropertyName: 'ASC' },
    });

    return hotels.map((hotel) => ({
      ...hotel,
      cleanliness_score: scaleToTen(hotel.cleanliness_score ?? null),
      food_score: scaleToTen(hotel.food_score ?? null),
      sleep_score: scaleToTen(hotel.sleep_score ?? null),
      internet_score: scaleToTen(hotel.internet_score ?? null),
      amenities_score: scaleToTen(hotel.amenities_score ?? null),
      final_score: scaleToTen(hotel.final_score ?? null),
    }));
  }

  async getHotelsWithIdBelow100() {
    return this.hotelRepo.find({
      where: { GlobalPropertyID: LessThan(100) },
      relations: ['manager'],
    });
  }

  async assignManagerToHotel(hotelId: number, managerId: number | null) {
    if (!Number.isInteger(hotelId)) {
      throw new BadRequestException('Invalid hotel ID');
    }

    const hotel = await this.hotelRepo.findOneBy({ GlobalPropertyID: hotelId });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (managerId === null) {
      hotel.manager = null;
      hotel.managerId = null;
      return this.hotelRepo.save(hotel);
    }

    const manager = await this.userRepo.findOne({
      where: { id: managerId },
      relations: ['managerHotel'],
    });

    if (!manager) throw new NotFoundException('Manager not found');
    if (manager.managerHotel) {
      throw new BadRequestException(
        'This manager is already assigned to a hotel',
      );
    }

    hotel.manager = manager;
    hotel.managerId = manager.id;

    return this.hotelRepo.save(hotel);
  }
}
function scaleToTen(normalized: number | null): number | null {
  if (normalized === null || normalized === undefined) return null;
  return Math.round((normalized * 9 + 1) * 100) / 100;
}
