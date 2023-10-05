import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  create(data: Prisma.QuizCreateInput) {
    console.debug({ createQuiz: data })

    return this.prisma.quiz.create({
      data: data
    })
  }

  findAll() {
    return this.prisma.quiz.findMany()
  }

  findOne(where: Prisma.QuizWhereUniqueInput) {
    return this.prisma.quiz.findUnique({
      where,
    })
  }

  async update(where: Prisma.QuizWhereUniqueInput, data: Prisma.QuizUpdateInput) {
    let quiz: any
    try {
      quiz = await this.prisma.quiz.update({
        where,
        data: data,
      })
    } catch (e: any) {
      throw new Error(e)
    }
    return quiz
  }

  remove(where: Prisma.QuizWhereUniqueInput) {
    return this.prisma.quiz.delete({
      where,
    })
  }
}
