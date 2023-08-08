import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request as RequestType } from 'express'
import { ClerkService } from '../../clerk/clerk.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private jwtConstants: any

  constructor(private config: ConfigService, private clerkService: ClerkService) {
    const mode = config.get('MODE') || 'dev'
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: mode == 'dev' || mode == 'test',
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  // https://clerk.com/docs/reference/node/getting-started
  async validate(payload: { sub: string; sessionId?: string; clientToken?: string }) {
    /*
    const lastSessionId = await this.clerkService.retrieveLastSessionId(payload.clientToken)
    // FIXME: remove
    const session = await this.clerkService.verifySession(
      payload.clientToken,
      payload.sessionId || lastSessionId,
    )*/
    // const user = await this.clerkService.verifyClient(payload.clientToken)
    /*

    console.debug(session)

    if (!session) return null //throws the 401 error
*/

    return { userId: payload.sub }
    // whatever is returned is appended to req.user
  }
  private static extractJWTFromCookie(req: RequestType): string | null {
    const tokenField = 'token'
    console.debug({ cookies: req.cookies })
    if (req.cookies && tokenField in req.cookies && req.cookies[tokenField].length > 0) {
      console.debug('extract: cookie')
      return req.cookies.token
    }
    return null
  }
}
