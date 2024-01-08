import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './google.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google')
  @UseGuards(GoogleGuard)
  auth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('unauthenticated');
    const token = await this.authService.signIn(user);
    res.cookie('access_token', token, {
      maxAge: 7 * 24 * 60 * 60,
      secure: false,
      sameSite: false,
    });
    return res.status(HttpStatus.OK);
  }
}
