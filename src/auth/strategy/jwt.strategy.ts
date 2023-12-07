import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtDto } from '../dto/auth.dto'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtDto) {
    if (!payload) throw new UnauthorizedException('Unauthorized')

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException('Unauthorized')

    return {
      id: payload.sub,
      email: payload.email,
    }
  }
}
