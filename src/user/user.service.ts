import { Injectable } from '@nestjs/common'
import { ClerkService } from '../clerk/clerk.service'
import { EditUserDto } from './dto'
import { ClerkClient } from '@clerk/clerk-sdk-node/dist/types/types'

@Injectable()
export class UserService {
  private clerk: ClerkClient
  constructor(private clerkService: ClerkService) {
    this.clerk = clerkService.clerk
  }

  async findOne(userId: string) {
    console.debug({ userId })
    const user = await this.clerk.users.getUser(userId)
    return user
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.clerk.users.updateUser(userId, dto)
    return user
  }

  async deleteUser(userId: string) {
    const user = await this.clerk.users.deleteUser(userId)
    return user
  }
}
