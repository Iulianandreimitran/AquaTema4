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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Post()
  @UseGuards(new RolesGuard('administrator')) // doar admin poate crea useri
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
