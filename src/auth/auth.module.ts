import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategy/google.strategy'
import { PrismaModule } from '@/prisma/prisma.module'
import { JwtStrategy } from './strategy/jwt.strategy'
import { UserService } from '@/user/user.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthSerializer } from './serializer/auth.serializer'
import { PassportModule } from '@nestjs/passport'

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, UserService, AuthSerializer],
  imports: [JwtModule, PrismaModule, PassportModule],
})
export class AuthModule {}
