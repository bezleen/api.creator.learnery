import { Injectable, OnModuleInit } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request as RequestType } from 'express'
import { ClerkService } from '../../clerk/clerk.service'
import { AuthService } from '../auth.service'
import { CookieJWT } from '../dto'
import NodeCache from 'node-cache'
import { Client, Session } from '@clerk/clerk-sdk-node'

let cookieName: string
let validatorTimeoutInSeconds: number = 60 * 60 * 24
@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy, 'jwt')
  implements OnModuleInit
{
  private clientCache: NodeCache
  private sessionCache: NodeCache

  constructor(
    private readonly config: ConfigService,
    private readonly clerkService: ClerkService,
    private readonly authService: AuthService,
  ) {
    const mode = config.get('MODE') || 'dev'
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: mode == 'dev' || mode == 'test',
      secretOrKey: config.get('JWT_SECRET'),
    })
    cookieName = config.get('COOKIE_NAME') || 'token'
  }

  onModuleInit() {
    this.clientCache = new NodeCache({ stdTTL: 100, checkperiod: 200 })
    this.sessionCache = new NodeCache({ stdTTL: 20, checkperiod: 40 })
    cookieName = this.config.get('COOKIE_NAME')
  }

  // https://clerk.com/docs/reference/node/getting-started
  async validate(payload: CookieJWT) {
    const { sessionId, clientId, sub: userId } = payload
    console.log({ payload })
    let client: Client = await this.clientCache.get(clientId)
    console.log({ client: this.clientCache.stats })

    if (!client) {
      client = await this.clerkService.clerk.clients.getClient(clientId)
      if (!client) return null //throws the 401 error
      this.clientCache.set(clientId, client)
    }

    console.log({ session: this.sessionCache.stats })

    const session: Session =
      (await this.sessionCache.get(sessionId)) ||
      client.sessions.find((session) => session.id === sessionId)

    console.debug({ session })

    if (this.config.get('MODE') == 'prod') {
      if (session.status != 'active') {
        console.debug({ sessionStatus: 'invalid' })
        return null
      } //throws the 401 error
    }

    if (!session) return null //throws the 401 error

    this.sessionCache.set(sessionId, session)

    return { userId: session.userId }
    // whatever is returned is appended to req.user
  }
  private static extractJWTFromCookie(req: RequestType): string | null {
    const cookies = {
      ...req.cookies,
      ...req.signedCookies,
    }
    console.debug({ cookies: JSON.stringify(cookies) })
    if (cookies && cookieName in cookies) {
      console.debug('found cookie', cookieName)
      return cookies[cookieName]
    }
    return null
  }
}
