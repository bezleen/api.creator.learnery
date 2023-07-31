import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GraphqlContext } from '../../app.dto'

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    if (data) return request.user[data]

    return request.user
  },
)

export const GetUserGraphql = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const ctx: GraphqlContext = GqlExecutionContext.create(context).getContext()

    const { user } = ctx.req

    if (data) return user[data]

    return user
  },
)
