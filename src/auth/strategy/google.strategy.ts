import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Prisma, User } from '@prisma/client'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { id, name, emails } = profile
      const user = {
        // provider: 'google',
        // providerId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        // accessToken,
      }
      done(null, user)
    } catch (error: any) {
      done(error, null)
    }
  }
}
