import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
@Injectable()
export class GoogleStartegy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_END === 'production'
          ? 'https://devmarketplace-backend.onrender.com/auth/google/callback'
          : 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: VerifyCallback,
  ): Promise<any> {
    const { name, email, picture } = profile._json;
    const user = {
      email,
      name,
      profilePicture: picture,
    };
    cb(null, user);
  }
}
