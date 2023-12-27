import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'
import { AuthDto } from './dto/auth.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'))
  }

  async signIn(data: any) {
    if (!data) {
      throw new BadRequestException('Unauthenticated')
    }

    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } })

    if (!userExists) {
      return this.registerUser(data)
    }

    const tokens = await this.getToken(userExists.id, userExists.email)

    const saltRounds = 10
    const hash = await bcrypt.hash(tokens.refreshToken, saltRounds)

    await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        refreshToken: hash,
      },
    })

    return tokens
  }

  async registerUser(data: Prisma.UserCreateInput) {
    try {
      const newUser = await this.userService.create(data)

      const tokens = await this.getToken(newUser.id, newUser.email)

      return tokens
    } catch (error: any) {
      throw new InternalServerErrorException()
    }
  }

  async verifyGoogleToken(data: AuthDto): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: data.tokenId,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })

      const payload = ticket.getPayload()

      if (!payload) {
        throw new Error('Invalid Google token')
      }

      const { email } = payload
      const userExists = await this.prisma.user.findUnique({
        where: { email: email },
      })

      if (!userExists) {
        return this.registerUser({
          email: email,
          firstName: payload?.given_name,
          lastName: payload?.family_name,
          avatar: payload?.picture,
        })
      }

      const tokens = await this.getToken(userExists.id, userExists.email)

      return tokens
    } catch (error) {
      throw new Error('Invalid Google token')
    }
  }

  async getToken(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: this.configService.get('JWT_MAX_AGE'),
        secret: this.configService.get('JWT_SECRET'),
      },
    )

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_MAX_AGE'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    )

    const saltRounds = 10
    const hash = await bcrypt.hash(refreshToken, saltRounds)

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getToken(user.id, user.email)

    return tokens
  }

  async logout(userId: string) {
    const user = await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: {
        refreshToken: null,
      },
    })

    return user
  }
}
