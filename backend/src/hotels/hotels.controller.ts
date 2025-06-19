import {
  Controller,
  Get,
  Req,
  UseGuards,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import {  ForbiddenException } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@Controller('hotels')
@UseGuards(JwtAuthGuard)
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('my-hotels')
  @UseGuards(JwtAuthGuard)
  async getMyHotels(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.hotelsService.getHotelsByManager(userId);
  }

  @Get('/assignable')
  @Get('unassigned')
  @UseGuards(new RolesGuard('administrator'))
  getUnassignedHotels() {
    return this.hotelsService.getUnassignedHotels();
  }

  @Get('group-hotels')
  @UseGuards(JwtAuthGuard)
  async getHotelsByGroupManager(@Req() req: Request) {
    const user = req['user'];
    const roles = (user?.roles || []).map(r => r.toLowerCase().replace(/\s/g, "_"));

    if (!roles.includes('hotel_manager')) {
      throw new ForbiddenException('Only hotel managers can access group hotels');
    }

    return this.hotelsService.getHotelsByGroupManager(user.sub);
  }
  @Get("debug-user")
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() req: Request) {
    console.log("👤 JWT user roles:", req['user'].roles);
    return req['user'];
  }


  @Get("/assignable")
  @UseGuards(new RolesGuard('administrator'))
  getAssignableHotels() {
    return this.hotelsService.getHotelsWithIdBelow100();
  }

  @Patch(':id/assign-manager')
  @UseGuards(new RolesGuard('administrator'))
  assignManager(
    @Param('id', ParseIntPipe) hotelId: number,
    @Body() body: { managerId: number | null },
  ) {
    return this.hotelsService.assignManagerToHotel(hotelId, body.managerId);
  }

  @Get('/grouped-by-city')
  getHotelsGroupedByCity() {
    return this.hotelsService.getRankedHotelsGroupedByCity();
  }

  @Get('/heatmap-data')
  getHeatmapData() {
    return this.hotelsService.getHeatmapDataFromGroupedHotels();
  }
}
