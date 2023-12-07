import { PassportSerializer } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { PrismaService } from '@/prisma/prisma.service'
import { VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {
    super()
  }

  async serializeUser(user: any, done: VerifyCallback) {
    done(null, user.email)
  }

  async deserializeUser(email: string, done: VerifyCallback) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: email } })
      return done(null, user)
    } catch (error: any) {
      return done(error, false)
    }
  }
}
