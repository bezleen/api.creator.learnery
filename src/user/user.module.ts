import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserController, UserResolver],
})
export class UserModule {}
