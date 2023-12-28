import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    console.log('break point 1')
    const activate = (await super.canActivate(context)) as boolean
    console.log('break point 2')
    const request = context.switchToHttp().getRequest()
    console.log('break point 3')
    await super.logIn(request)
    console.log('break point 4')
    return activate
  }
}
