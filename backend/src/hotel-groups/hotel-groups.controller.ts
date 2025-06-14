import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HotelGroupsService } from './hotel-groups.service';
import { CreateHotelGroupDto } from './dto/create-hotel-group.dto';
import { UpdateHotelGroupDto } from './dto/update-hotel-group.dto';

@Controller('hotel-groups')
export class HotelGroupsController {
  constructor(private readonly hotelGroupsService: HotelGroupsService) {}

  @Post()
  create(@Body() createHotelGroupDto: CreateHotelGroupDto) {
    return this.hotelGroupsService.create(createHotelGroupDto);
  }

  @Get()
  findAll() {
    return this.hotelGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelGroupDto: UpdateHotelGroupDto) {
    return this.hotelGroupsService.update(+id, updateHotelGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelGroupsService.remove(+id);
  }
}
