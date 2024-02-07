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
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy'
import { LocalStrategy } from './strategy/local.strategy'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    UserService,
    AuthSerializer,
    JwtRefreshStrategy,
    LocalStrategy,
  ],
  imports: [JwtModule, PrismaModule, PassportModule],
})
export class AuthModule {}
