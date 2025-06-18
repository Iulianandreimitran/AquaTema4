import { Injectable } from '@nestjs/common';
import { CreateHotelGroupDto } from './dto/create-hotel-group.dto';
import { UpdateHotelGroupDto } from './dto/update-hotel-group.dto';
import { HotelGroup } from './entities/hotel-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from '../hotels/hotel.entity';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class HotelGroupsService {
  constructor(
    @InjectRepository(HotelGroup)
    private readonly hotelGroupRepo: Repository<HotelGroup>,

    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,

     private hotelsService: HotelsService
  ) {}

  async create(dto: CreateHotelGroupDto) {
    const newGroup = this.hotelGroupRepo.create({
      name: dto.name,
      managerId: dto.managerId,
    });

    return this.hotelGroupRepo.save(newGroup);
  }

  async findAll() {
    return this.hotelGroupRepo.find({ relations: ['manager', 'hotels'] });
  }

  async findOne(id: number) {
    return this.hotelGroupRepo.findOne({
      where: { id },
      relations: ['manager', 'hotels'],
    });
  }

  async update(id: number, updateDto: UpdateHotelGroupDto) {
    await this.hotelGroupRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const group = await this.findOne(id);
    if (!group) throw new Error("Group not found");
    return this.hotelGroupRepo.remove(group);
  }

  async assignHotelToGroup(hotelId: number, groupId: number) {
    const hotel = await this.hotelRepo.findOneBy({ GlobalPropertyID: hotelId });
    if (!hotel) throw new Error("Hotel not found");

    hotel.groupId = groupId;
    return this.hotelRepo.save(hotel);
  }

  async removeHotelFromGroup(hotelId: number) {
    await this.hotelRepo.update(hotelId, { groupId: null });
    return { message: 'Hotel removed from group' };
  }

}

