import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { UserResolver } from './user.resolver'
import { ClerkService } from '../clerk/clerk.service'
import { ClerkModule } from '../clerk/clerk.module'

@Module({
  imports: [AuthModule, PrismaModule, ClerkModule],
  controllers: [UserController],
  providers: [UserService, UserController, UserResolver, ClerkService],
})
export class UserModule {}
