import { Controller, UseGuards, Get, Req, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { HotelGroupsService } from './hotel-groups.service';
import { CreateHotelGroupDto } from './dto/create-hotel-group.dto';
import { UpdateHotelGroupDto } from './dto/update-hotel-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('hotel-groups')
export class HotelGroupsController {
  constructor(private readonly hotelGroupsService: HotelGroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) 
  async createHotelGroup(
    @Body() body: { name: string; managerId: number },
    @Req() req: Request
  ) {
    const user = req['user'];

    const roles = (user?.roles || []).map(r => r.toLowerCase());
    if (!roles.includes('administrator')) {
      throw new ForbiddenException('Only administrators can create hotel groups');
    }

    return this.hotelGroupsService.create(body);
  }

  @Get('debug-user')
  @UseGuards(JwtAuthGuard)
  getUserDebug(@Req() req: Request) {
    console.log("🧾 Received user:", req['user']);
    return req['user'];
  }

  @Get()
  findAll() {
    return this.hotelGroupsService.findAll();
  }

  @Patch('assign-hotel')
  @UseGuards(JwtAuthGuard) 
  async assignHotelToGroup(
    @Body() body: { hotelId: number; groupId: number },
    @Req() req: Request
  ) {
    const user = req['user'];

    if (!user?.roles?.includes('administrator')) {
      throw new ForbiddenException('Only administrators can assign hotels to groups');
    }

    return this.hotelGroupsService.assignHotelToGroup(body.hotelId, body.groupId);
  }

  @Patch('remove-hotel')
  @UseGuards(JwtAuthGuard)
  async removeHotelFromGroup(@Body() body: { hotelId: number }, @Req() req: Request) {
    const user = req['user'];
    if (!user?.roles?.includes('administrator')) {
      throw new ForbiddenException('Only administrators can remove hotels from groups');
    }

    return this.hotelGroupsService.removeHotelFromGroup(body.hotelId);
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

  @Delete(':id/force')
  async forceRemove(@Param('id') id: string) {
    return this.hotelGroupsService.forceDelete(+id);
  }

}
