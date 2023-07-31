import { Query, Resolver } from '@nestjs/graphql'
import { UserController } from './user.controller'
import { GetUserGraphql } from '../auth/decorator'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guard'

@UseGuards(GqlAuthGuard)
@Resolver('User')
export class UserResolver {
  constructor(private readonly userController: UserController) {}

  @Query('me')
  me(@GetUserGraphql('userId') userId: number) {
    return this.userController.getMe(userId)
  }
}
