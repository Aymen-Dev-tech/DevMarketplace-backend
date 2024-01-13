import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('profile')
  async profile(@Req() req) {
    const { userId } = req.user;
    return await this.userService.findOneById(userId);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }
}
