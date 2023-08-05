import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module'
import { JwtStrategy } from './strategy'
import { AuthResolver } from './auth.resolver'
import { ClerkService } from '../clerk/clerk.service'

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthResolver, AuthController, ClerkService],
})
export class AuthModule {}
