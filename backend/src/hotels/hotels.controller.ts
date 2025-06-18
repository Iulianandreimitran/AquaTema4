import { Controller, Get, Req, UseGuards, Patch, Body, Param } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIntPipe } from "@nestjs/common";

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

  @Get("/assignable")
  @UseGuards(new RolesGuard('administrator'))
  getAssignableHotels() {
    return this.hotelsService.getHotelsWithIdBelow100();
  }
    
  @Patch(":id/assign-manager")
  @UseGuards(new RolesGuard('administrator'))
  assignManager(
    @Param("id", ParseIntPipe) hotelId: number,
    @Body() body: { managerId: number | null }
  ) {
    return this.hotelsService.assignManagerToHotel(hotelId, body.managerId);
  }

}
