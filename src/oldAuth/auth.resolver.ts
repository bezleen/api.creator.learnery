// import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
// import { AuthService } from './auth.service'
// import { AuthController } from './auth.controller'
// import { GraphqlContext } from '@app/dto/request.dto'
// import { AuthDto } from './dto'
// import { AuthInput } from '../graphql'

// @Resolver('Auth')
// export class AuthResolver {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly authController: AuthController,
//   ) {}

//   @Mutation('signIn')
//   signIn(@Args('data') dto: AuthDto, @Context() ctx: GraphqlContext) {
//     console.debug({ dto })

//     return this.authController.signin(dto as AuthInput, ctx.res, ctx.req)
//   }
// }
