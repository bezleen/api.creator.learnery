import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  MaterialType = {
    MATERIAL_WORKSHEET: 'worksheet',
    MATERIAL_QUIZ: 'quiz',
    MATERIAL_PT: 'performanceTask',
  }

  async getTransactions(userId: string) {
    try {
      const response = await axios.get(
        `${this.configService.get(
          'PAYMENT_SERVICE_URL',
        )}/v1/api/internal/billing/transactions/${userId}`,
      )

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server')
      }

      const transactions: Array<any> = response.data

      for (const transaction of transactions) {
        if (transaction.typeOfTransactions === 'USAGE') {
          const materialRequest = await this.prisma.material.findFirst({
            where: { ticketId: transaction.id },
            select: {
              request: true,
            },
          })

          const materialTitle =
            materialRequest.request[this.MaterialType[transaction.extension]].title

          transaction.materialName = materialTitle
        }
      }
      return transactions
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
