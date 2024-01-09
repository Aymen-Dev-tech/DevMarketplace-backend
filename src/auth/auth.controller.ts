import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './google.guard';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google')
  @UseGuards(GoogleGuard)
  auth(@Req() req: Request) {
    return req.user;
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('unauthenticated');
    const newUser: User = await this.authService.validateUser(user);
    const token = this.authService.generateJwt({ sub: newUser.id });
    res.cookie('access_token', token, {
      sameSite: 'strict',
      httpOnly: false,
      maxAge: 60 * 60,
    });
    return res.redirect('/');
  }
}
