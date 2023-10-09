import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorksheetService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  create(data: Prisma.WorksheetCreateInput) {
    if(Object.keys(data.questionTypes).length > 3){
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    console.debug({ createWorksheet: data })

    return this.prisma.worksheet.create({
      data: data
    })
  }

  findAll() {
    return this.prisma.worksheet.findMany()
  }

  findOne(where: Prisma.WorksheetWhereUniqueInput) {
    return this.prisma.worksheet.findUnique({
      where,
    })
  }

  async update(where: Prisma.WorksheetWhereUniqueInput, data: Prisma.WorksheetUpdateInput) {
    let worksheet: any
    try {
      worksheet = await this.prisma.worksheet.update({
        where,
        data: data,
      })
    } catch (e: any) {
      throw new Error(e)
    }
    return worksheet
  }

  remove(where: Prisma.WorksheetWhereUniqueInput) {
    return this.prisma.worksheet.delete({
      where,
    })
  }
}