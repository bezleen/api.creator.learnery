import { Injectable } from '@nestjs/common'
// import { ClerkService } from '../clerk/clerk.service'
// import { EditUserDto } from './dto'
// import { ClerkClient } from '@clerk/clerk-sdk-node/dist/types/types'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  // private clerk: ClerkClient
  constructor(
    // private clerkService: ClerkService,
    private readonly prisma: PrismaService,
  ) {
    // this.clerk = clerkService.clerk
  }

  // async findOne(userId: string) {
  //   console.debug({ userId })
  //   const user = await this.clerk.users.getUser(userId)
  //   return user
  // }

  // async editUser(userId: string, dto: EditUserDto) {
  //   const user = await this.clerk.users.updateUser(userId, dto)
  //   return user
  // }

  // async deleteUser(userId: string) {
  //   const user = await this.clerk.users.deleteUser(userId)
  //   return user
  // }

  async findOne(where: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({
      where,
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    })
  }
}
