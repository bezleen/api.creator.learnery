import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Patch,
  UseGuards,
} from '@nestjs/common'
// import { JwtGuard } from '../oldAuth/guard'
// import { GetUser } from '../oldAuth/decorator'
import { EditUserDto } from './dto'
import { UserService } from './user.service'
import { GetUser } from '@/auth/decorator/get-user.decorator'
import { JwtAuthGuard } from '@/auth/guard/jwt.guard'
import { GetUserId } from '@/auth/decorator/get-user-id.decorator'
import { ApiBearerAuth } from '@nestjs/swagger'

@Injectable()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('me')
  async getMe(@GetUser('id') userId: string) {
    return await this.userService.findOne(userId)
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  async editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return await this.userService.editUser(userId, dto)
  }
}
