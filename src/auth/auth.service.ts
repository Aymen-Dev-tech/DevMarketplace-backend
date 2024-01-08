import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  async signIn(user) {
    console.log('user email: ', user.email);

    const result = await this.userService.findOne(user.email);

    if (!result) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: result.id,
    });
  }

  async registerUser(user) {
    const newUser = await this.userService.create(user);
    return this.generateJwt({
      sub: newUser.id,
      email: newUser.email,
    });
  }
}
