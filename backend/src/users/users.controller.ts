import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { BadRequestException  } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('search') search: string = '',
    @Query('page') page: string = '1',
  ) {
    const pageNum = parseInt(page, 10);
    return this.usersService.getUsers(search, pageNum);
  }
  
  @Get("/hotel-managers")
  @UseGuards(new RolesGuard("administrator"))
  getHotelManagers() {
    return this.usersService.getUsersByRole("Hotel Manager");
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
      console.error("❌ Invalid user id:", id);
      throw new BadRequestException("Invalid user ID");
    }

    return this.usersService.findById(parsed);
  }

  @Post()
  @UseGuards(new RolesGuard('administrator'))
  async createUser(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  @UseGuards(new RolesGuard('administrator'))
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(+id, body);
  }

  @Delete(':id')
  @UseGuards(new RolesGuard('administrator'))
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }









}
