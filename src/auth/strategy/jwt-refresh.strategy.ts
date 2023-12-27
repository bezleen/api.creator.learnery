import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtDto } from '../dto/auth.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { Request } from 'express'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtDto) {
    const refreshToken = req.headers['authorization'].split(' ')[1]

    return {
      ...payload,
      refreshToken,
    }
  }
}
