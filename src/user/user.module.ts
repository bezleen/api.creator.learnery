import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
// import { AuthModule } from '../oldAuth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { UserResolver } from './user.resolver'
// import { ClerkService } from '../clerk/clerk.service'
// import { ClerkModule } from '../clerk/clerk.module'
import { AuthModule } from '@/auth/auth.module'

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserController, UserResolver],
})
export class UserModule {}
