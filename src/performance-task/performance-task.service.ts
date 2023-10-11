import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PerformanceTaskService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: Prisma.PerformanceTaskCreateInput) {
    const createdPerformanceTask = await this.prisma.materialPerformanceTask.create({
      data: {
        request: data,
        result: {},
      }
    })

    return createdPerformanceTask
  }

  findAll() {
    return this.prisma.materialPerformanceTask.findMany()
  }

  findOne(where: Prisma.MaterialPerformanceTaskWhereUniqueInput) {
    return this.prisma.materialPerformanceTask.findUnique({
      where,
    })
  }

  remove(where: Prisma.MaterialPerformanceTaskWhereUniqueInput) {
    return this.prisma.materialPerformanceTask.delete({
      where,
    })
  }
}
