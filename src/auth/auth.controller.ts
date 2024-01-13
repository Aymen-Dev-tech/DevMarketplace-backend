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
import { Public } from 'src/common/skip-auth.decorator';
import { QueryExtractorGuard } from './query-extractor.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Get('google')
  @UseGuards(QueryExtractorGuard, GoogleGuard)
  auth(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    //check if the req.user has been set by the passport
    if (!user) throw new UnauthorizedException('unauthenticated');
    const info = req.session.info;
    const result = await this.authService.validateUser(user, info);
    //clear the session for the next request
    req.session.destroy();
    if (result === 'redirect to login') {
      //redirects to login when an account already exist
      return res.redirect('http://localhost:5173/login');
    } else if (result === 'redirect to signup') {
      //redirects to signup when login with an account that does not exist
      return res.redirect('http://localhost:5173/signup');
    }
    //return cookie
    const token = this.authService.generateJwt({
      sub: result.id,
    });
    res.cookie('access_token', token, {
      secure: false,
      sameSite: 'none',
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:5173/marketplace');
  }

  @Get('logout')
  logout(@Res() res: Response) {
    console.log('logout called');
    res.clearCookie('access_token');
    return res.end();
  }
}
