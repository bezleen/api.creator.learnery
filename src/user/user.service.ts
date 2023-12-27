import { Injectable } from '@nestjs/common'
// import { ClerkService } from '../clerk/clerk.service'
import { EditUserDto } from './dto'
// import { ClerkClient } from '@clerk/clerk-sdk-node/dist/types/types'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: dto.firstName,
        avatar: dto.avatar,
        lastName: dto.lastName,
        email: dto.email,
      },
    })
    return user
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        avatar: true,
        createdDate: true,
        updatedDate: true,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    })
  }
}
