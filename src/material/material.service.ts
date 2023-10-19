import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MaterialType } from '@prisma/client';
import { CreateMaterialPerformanceTaskInputDTO, CreateMaterialQuizInputDTO, CreateMaterialWorksheetInputDTO } from './dto/create-material.input';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async createQuiz(data: CreateMaterialQuizInputDTO) {

    if (Object.keys(data.request.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    const createdQuiz = await this.prisma.material.create({
      data: {
        userId: data?.userId,
        type: MaterialType.QUIZ,
        request: {
          quiz: data.request
        },
        result: {},
        progressPercent: data?.progressPercent,
        progressStatus: data.progressStatus,
      }
    })
    return createdQuiz
  }

  async createPerformanceTask(data: CreateMaterialPerformanceTaskInputDTO) {

    const createdPerformanceTask = await this.prisma.material.create({
      data: {
        userId: data?.userId,
        type: MaterialType.PERFORMANCE_TASK,
        request: {
          performanceTask: data.request
        },
        result: {},
        progressPercent: data?.progressPercent,
        progressStatus: data.progressStatus,
      }
    })
    return createdPerformanceTask
  }

  async createWorksheet(data: CreateMaterialWorksheetInputDTO) {

    if (Object.keys(data.request.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    const createdWorksheet = await this.prisma.material.create({
      data: {
        userId: data?.userId,
        type: MaterialType.WORKSHEET,
        request: {
          worksheet: data.request
        },
        result: {},
        progressPercent: data?.progressPercent,
        progressStatus: data.progressStatus,
      }
    })
    return createdWorksheet
  }

  async findAll() {
    return await this.prisma.material.findMany({})
  }

  async findOne(where: Prisma.MaterialWhereUniqueInput) {
    return await this.prisma.material.findUnique({
      where,
    })
  }

  async remove(where: Prisma.MaterialWhereUniqueInput) {
    return await this.prisma.material.delete({
      where,
    })
  }
}
