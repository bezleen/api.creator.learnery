import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorksheetService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(data: Prisma.WorksheetCreateInput) {
    if(Object.keys(data.questionTypes).length > 3){
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    const createdWorksheet = await this.prisma.materialWorksheet.create({
      data: {
        request: data,
        result: {},
      }
    })

    return createdWorksheet
  }

  async findAll() {
    return await this.prisma.materialWorksheet.findMany()
  }

  findOne(where: Prisma.MaterialWorksheetWhereUniqueInput) {
    return this.prisma.materialWorksheet.findUnique({
      where,
    })
  }

  remove(where: Prisma.MaterialWorksheetWhereUniqueInput) {
    return this.prisma.materialWorksheet.delete({
      where,
    })
  }
}