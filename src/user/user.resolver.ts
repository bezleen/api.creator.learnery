import { Query, Resolver } from '@nestjs/graphql'
import { UserController } from './user.controller'
// import { GetUserGraphql } from '../oldAuth/decorator'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@/auth/guard/jwt.guard'
// import { GqlAuthGuard } from '../oldAuth/guard'

@UseGuards(GqlAuthGuard)
@Resolver('User')
export class UserResolver {
  constructor(private readonly userController: UserController) {}

  // @Query('me')
  // me(@GetUserGraphql('userId') userId: string) {
  //   return this.userController.getMe(userId)
  // }
}
