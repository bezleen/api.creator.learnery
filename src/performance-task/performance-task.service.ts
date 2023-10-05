import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PerformanceTaskService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(data: Prisma.PerformanceTaskCreateInput) {
    console.debug({ createPerformanceTask: data })

    return this.prisma.performanceTask.create({
      data: data
    })
  }

  findAll() {
    return this.prisma.performanceTask.findMany()
  }

  findOne(where: Prisma.PerformanceTaskWhereUniqueInput) {
    return this.prisma.performanceTask.findUnique({
      where,
    })
  }

  async update(where: Prisma.PerformanceTaskWhereUniqueInput, data: Prisma.PerformanceTaskUpdateInput) {
    let performanceTask: any
    try {
      performanceTask = await this.prisma.performanceTask.update({
        where,
        data: data,
      })
    } catch (e: any) {
      throw new Error (e)
    }
    return performanceTask
  }

  remove(where: Prisma.PerformanceTaskWhereUniqueInput) {
    return this.prisma.performanceTask.delete({
      where,
    })
  }
}
