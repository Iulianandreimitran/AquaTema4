import { Injectable } from '@nestjs/common';
import { CreateHotelGroupDto } from './dto/create-hotel-group.dto';
import { UpdateHotelGroupDto } from './dto/update-hotel-group.dto';

@Injectable()
export class HotelGroupsService {
  create(createHotelGroupDto: CreateHotelGroupDto) {
    return 'This action adds a new hotelGroup';
  }

  findAll() {
    return `This action returns all hotelGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hotelGroup`;
  }

  update(id: number, updateHotelGroupDto: UpdateHotelGroupDto) {
    return `This action updates a #${id} hotelGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotelGroup`;
  }
}
