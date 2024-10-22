import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/skip-auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('profile')
  async profile(@Req() req) {
    const { userId } = req.user;
    return await this.userService.findOneById(userId);
  }
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOneById(id);
  }
  @Public()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    console.log('i recieved this data: ', updateUserDto);
    return await this.userService.update(id, updateUserDto);
  }
}
