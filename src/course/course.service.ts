import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CourseUncheckedCreateInput) {
    console.log({ createAudienceInput: data })
    return this.prisma.course.create({
      data: data,
    })
  }

  findAll(where?: Prisma.CourseWhereInput) {
    return this.prisma.course.findMany({
      where,
    })
  }

  findOne(where: Prisma.CourseWhereUniqueInput) {
    return this.prisma.course.findUnique({
      where,
    })
  }

  update(where: Prisma.CourseWhereUniqueInput, data: Prisma.CourseUpdateInput) {
    return this.prisma.course.update({
      where,
      data: data,
    })
  }

  remove(userId: string, id: string) {
    return this.prisma.course.delete({
      where: {
        id: id,
        creatorId: userId,
      },
    })
  }
}
