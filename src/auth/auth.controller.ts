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
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GoogleAuthGuard } from './guard/auth.guard'
import { Request, Response } from 'express'
import { Prisma, User } from '@prisma/client'

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
}
