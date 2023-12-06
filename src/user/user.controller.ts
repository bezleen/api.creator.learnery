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
// import { EditUserDto } from './dto'
import { UserService } from './user.service'

@Injectable()
// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // @Get('me')
  // getMe(@GetUser('userId') userId: string) {
  //   return this.userService.findOne(userId)
  // }

  // @UseGuards(JwtGuard)
  // @Patch()
  // editUser(@GetUser('userId') userId: string, @Body() dto: EditUserDto) {
  //   return this.userService.editUser(userId, dto)
  // }

  // @UseGuards(JwtGuard)
  // @Delete()
  // async deleteUser(@GetUser('userId') userId: string) {
  //   return {
  //     message: 'user deleted',
  //     user: await this.userService.deleteUser(userId),
  //   }
  // }
}
