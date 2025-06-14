import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
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
    const user = await this.usersService.findById(+id);
    return user;
  }
}
