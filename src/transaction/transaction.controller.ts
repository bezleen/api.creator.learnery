import { Controller, Get, UseGuards } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { GetUserId } from '@/auth/decorator/get-user-id.decorator'
import { JwtAuthGuard } from '@/auth/guard/jwt.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('transaction')
@ApiTags('Payment')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@GetUserId() userId: string) {
    return await this.transactionService.getTransactions(userId)
  }
}
