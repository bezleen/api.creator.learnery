import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MaterialType } from '@prisma/client';
import axios from 'axios';
import { CreatePerformanceTaskInputDTO, CreateQuizInputDTO, CreateWorksheetInputDTO } from './dto/create-material.input';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async createQuiz(data: CreateQuizInputDTO) {

    // if (Object.keys(data.questionTypes).length > 3) {
    //   throw new BadRequestException('you can only choose 3 type of question ')
    // }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdQuiz = await this.prisma.material.create({
      data: {
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.QUIZ,
        request: {
          quiz: data
        },
        result: {},
      }
    })

    const payload_ai = {
      offer_id: createdQuiz.id,
      user_id: createdQuiz.userId
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

  async createPerformanceTask(data: CreatePerformanceTaskInputDTO) {

    // const regex = /^\s*(\d+)\s*.*/

    // if (!regex.test(data.timeActivity) ){
    //   throw new Error('Invalid time format!');
    // }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdPerformanceTask = await this.prisma.material.create({
      data: {
        // userId: data?.userId,
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.PERFORMANCE_TASK,
        request: {
          performanceTask: data
        },
        result: {},
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

  async createWorksheet(data: CreateWorksheetInputDTO) {

    if (Object.keys(data.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdWorksheet = await this.prisma.material.create({
      data: {
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.WORKSHEET,
        request: {
          worksheet: data
        },
        result: {},
      }
    })

    const payload_ai = {
      offer_id: createdWorksheet.id,
      user_id: createdWorksheet.userId
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
