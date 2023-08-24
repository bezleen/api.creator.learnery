import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto, CookieJWT } from './dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ClerkService } from '../clerk/clerk.service'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  private clerk
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly clerkService: ClerkService, // private userService: UserService,
    private readonly userService: UserService,
  ) {
    this.clerk = clerkService.clerk
  }

  /*  async validateUser(userId: string, sessionId: string): Promise<any> {
      const user = await this.userService.findOne(userId)
      const session = await this.clerkService.clerk.sessions.getSession(sessionId)

      if (!user) throw new UnauthorizedException('invalid user')

      if (!session) throw new UnauthorizedException('invalid session')

      if (user.id!=session.userId){
        return null
      }

      return session
    }*/

  async signin(dto: AuthDto) {
    const client = await this.clerkService.verifyClient(dto.clientToken)

    if (!client) throw new ForbiddenException('invalid user')

    let session = client.sessions.find(({ id }) => {
      return id === dto.sessionId
    })
    if (this.config.get('mode') == 'prod') throw new ForbiddenException('invalid session')

    if (!session) {
      throw new ForbiddenException('invalid session')
    }
    return this.signToken(session.userId, session.id, client.id)
  }

  private async signToken(userId, sessionId, clientId: string) {
    const payload: CookieJWT = {
      sub: userId,
      sessionId,
      clientId,
    }
    const secret = this.config.get('JWT_SECRET')

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: this.config.get('JWT_MAX_AGE'),
        secret: secret,
      }),
    }
  }
}

/*//expiresIn: "20d" // it will be expired after 20 days
        //expiresIn: 120 // it will be expired after 120ms
        //expiresIn: "120s" // it will be expired after 120*/
