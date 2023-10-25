import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MaterialType } from '@prisma/client';
import axios from 'axios';
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

    const payload_ai = {
      offer_id: createdQuiz.id,
      user_id: createdQuiz.userId || "string"
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/quiz', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }

    return createdQuiz
  }

  async createPerformanceTask(data: CreateMaterialPerformanceTaskInputDTO) {

    const createdPerformanceTask = await this.prisma.material.create({
      data: {
        // userId: data?.userId,
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.PERFORMANCE_TASK,
        request: {
          performanceTask: data.request
        },
        result: {},
        progressPercent: data?.progressPercent,
        progressStatus: data.progressStatus,
      }
    })

    const payload_ai = {
      offer_id: createdPerformanceTask.id,
      user_id: createdPerformanceTask.userId
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/performance-task', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }

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

    const payload_ai = {
      offer_id: createdWorksheet.id,
      user_id: createdWorksheet.userId || "string"
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/worksheet', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }


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
