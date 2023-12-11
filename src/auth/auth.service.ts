import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'

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

    return await this.jwtService.signAsync(
      {
        sub: userExists.id,
        email: userExists.email,
      },
      {
        expiresIn: this.configService.get('JWT_MAX_AGE'),
        secret: this.configService.get('JWT_SECRET'),
      },
    )
  }

  async registerUser(data: Prisma.UserCreateInput) {
    try {
      const newUser = await this.userService.create(data)

      return await this.jwtService.signAsync(
        {
          sub: newUser.id,
          email: newUser.email,
        },
        {
          expiresIn: this.configService.get('JWT_MAX_AGE'),
          secret: this.configService.get('JWT_SECRET'),
        },
      )
    } catch (error: any) {
      throw new InternalServerErrorException()
    }
  }

  async verifyGoogleToken(tokenId: string): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: tokenId,
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
        })
      }

      return await this.jwtService.signAsync(
        {
          sub: userExists.id,
          email: userExists.email,
        },
        {
          expiresIn: this.configService.get('JWT_MAX_AGE'),
          secret: this.configService.get('JWT_SECRET'),
        },
      )
    } catch (error) {
      throw new Error('Invalid Google token')
    }
  }
}
