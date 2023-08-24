import { ConflictException, Injectable } from '@nestjs/common'
import { CreateAudience } from './dto/create-audience.input'
import { UpdateAudience } from './dto/update.audience'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class AudienceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAudienceInput: CreateAudience) {
    const { ageStart, ageEnd } = createAudienceInput
    if (ageStart > ageEnd || ageStart == ageEnd) {
      throw new ConflictException('invalid age range')
    }

    return this.prisma.audience.create({
      data: createAudienceInput,
    })
  }

  findAll() {
    return this.prisma.audience.findMany()
  }

  findOne(where: Prisma.AudienceWhereUniqueInput) {
    return this.prisma.audience.findUnique({
      where,
    })
  }

  update(id: string, updateAudienceInput: UpdateAudience) {
    return this.prisma.audience.update({
      where: {
        id,
      },
      data: updateAudienceInput,
    })
  }

  remove(id: string) {
    return this.prisma.audience.delete({
      where: {
        id: id,
      },
    })
  }
}
