import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }
  async validateUser(user): Promise<User> {
    console.log('user email: ', user.email);

    const result = await this.userService.findOne(user.email);

    if (!result) {
      return this.registerUser(user);
    }
    return result;
  }
  async registerUser(user): Promise<User> {
    return await this.userService.create(user);
  }
}
