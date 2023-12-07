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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}

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
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
