import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GraphqlContext } from '../app.dto'
import { AuthDto } from './dto'
import { AuthInput } from '../graphql'

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authController: AuthController,
  ) {}

  @Mutation('signUp')
  signUp(@Args('data') dto: AuthDto) {
    console.debug({ dto })

    return this.authController.signup(dto as AuthInput)
  }

  @Mutation('signIn')
  signIn(@Args('data') dto: AuthDto, @Context() ctx: GraphqlContext) {
    console.debug({ dto })

    return this.authController.signin(dto as AuthInput, ctx.res)
  }
}
