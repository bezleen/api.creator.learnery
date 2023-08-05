import { Injectable } from '@nestjs/common'
import { Clerk } from '@clerk/clerk-sdk-node'
import { ConfigService } from '@nestjs/config'
import { ClerkClient } from '@clerk/clerk-sdk-node/dist/types/types'

@Injectable()
export class ClerkService {
  public readonly clerk: ClerkClient

  constructor(private readonly config: ConfigService) {
    this.clerk = Clerk({ secretKey: config.get('CLERK_SECRET_KEY') })
  }

  private getClient(clientToken: string) {
    return this.clerk.clients.verifyClient(clientToken).catch((err) => {
      console.log({ getClientError: err })
    })
  }
  async verifyClient(clientToken: string) {
    return this.getClient(clientToken)
  }

  async retrieveLastSessionId(clientToken: string) {
    let client = await this.getClient(clientToken)
    if (client) {
      return client.lastActiveSessionId
    }
  }

  async verifySession(clientToken: string, sessionId: string) {
    let client = await this.verifyClient(clientToken)
    if (!client) {
      return
    }
    const session = client.sessions.find(({ id }) => {
      return id === sessionId
    })

    return session
  }
}
