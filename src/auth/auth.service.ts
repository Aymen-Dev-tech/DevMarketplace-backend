import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BuyersService } from 'src/buyers/buyers.service';
import { SellersService } from 'src/sellers/sellers.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sellerService: SellersService,
    private buyerService: BuyersService,
    private jwtService: JwtService,
  ) {}
  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }
  async validateUser(user, info) {
    //checking for account existence
    const result = await this.userService.findOne(user.email);
    if (result) {
      //account exist and user tries to signup
      if (info && Object.values(info).length > 0) return 'redirect to login';
      //account exist and user tried to login
      return result;
    } else {
      if (info && Object.values(info).length > 0) {
        //account does not exist and user perform singup
        console.log('about to create an account with : ', info);
        const { phoneNumber, role } = info;
        const account = { ...user, phoneNumber, role };
        return this.registerUser(account);
      }
      //account does not exist and user perform login
      return 'redirect to signup';
    }
  }
  async registerUser(user): Promise<User> {
    const { role } = user;
    delete user.role;
    const userAccount = await this.userService.create(user);
    if (role === 'seller') {
      await this.sellerService.create(userAccount.id);
    } else {
      await this.buyerService.create(userAccount.id);
    }
    return userAccount;
  }
}
