import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GoogleAuthGuard } from './guard/auth.guard'
import { Request, Response } from 'express'
import { Prisma, User } from '@prisma/client'
import { string } from 'joi'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.authService.signIn(req.user)

      return res.status(200).json({
        accessToken: token,
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }

  @Post('login')
  @ApiBody({ description: 'tokenId for authentication', type: AuthDto })
  async login(@Body() data: AuthDto, @Res() res: Response): Promise<any> {
    try {
      const token = await this.authService.verifyGoogleToken(data)
      return res.status(200).json({
        accessToken: token,
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
