import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

}
