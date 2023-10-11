import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ProgressStatus } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(data: Prisma.QuizCreateInput) {
    if(Object.keys(data.questionTypes).length > 3){
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    const createdQuiz = await this.prisma.materialQuiz.create({
      data: {
        request: data,
        result: {},
      }
    })

    return createdQuiz
  }

  async findAll() {
    return await this.prisma.materialQuiz.findMany()
  }

  async findOne(where: Prisma.MaterialQuizWhereUniqueInput) {

    return this.prisma.materialQuiz.findUnique({
      where,
    })
  }

  remove(where: Prisma.MaterialQuizWhereUniqueInput) {
    return this.prisma.materialQuiz.delete({
      where,
    })
  }
}
