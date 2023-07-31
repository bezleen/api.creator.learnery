import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/guard'
import { GetUser } from '../auth/decorator'
import { EditUserDto } from './dto'
import { UserService } from './user.service'

@Injectable()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('userId') userId: number) {
    return this.userService.findOne(userId)
  }

  @UseGuards(JwtGuard)
  @Patch()
  editUser(@GetUser('userId') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto)
  }

  @UseGuards(JwtGuard)
  @Delete()
  async deleteUser(@GetUser('userId') userId: number) {
    return {
      message: 'user deleted',
      user: await this.userService.deleteUser(userId),
    }
  }
}
