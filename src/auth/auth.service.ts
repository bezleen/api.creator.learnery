import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ClerkService } from '../clerk/clerk.service'

@Injectable()
export class AuthService {
  private clerk
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private clerkService: ClerkService, // private userService: UserService,
  ) {
    this.clerk = clerkService.clerk
  }

  async validateUser(accessToken: string): Promise<any> {
    // Implement user validation logic using Clerk.com SDK or fetch user data from the backend database based on the access token.
    // Return the user object or null if the user is not authenticated.
    // Example: Fetch user data using Clerk.com SDK based on the provided access token.

    // For example:
    const user = await this.clerkService.verifyClient(accessToken)
    if (user) {
      // User is authenticated, return the user object
      return user
    }
    // User is not authenticated, return null
    return null
  }

  async signin(dto: AuthDto) {
    const client = await this.clerkService.verifyClient(dto.clientToken)

    if (!client) throw new ForbiddenException('invalid user')

    let session = client.sessions.find(({ id }) => {
      return id === dto.sessionId
    })

    if (!session) throw new ForbiddenException('invalid session')

    return this.signToken(session.userId, session.id, client.id)
  }

  private async signToken(userId, sessionId, clientId: string) {
    const payload = {
      sub: userId,
      sessionId,
      clientId,
    }
    const secret = this.config.get('JWT_SECRET')

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '1hr', //TODO:
        secret: secret,
      }),
    }
  }
}
