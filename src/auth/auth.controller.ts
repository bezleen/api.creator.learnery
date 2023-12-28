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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GoogleAuthGuard } from './guard/auth.guard'
import { Request, Response } from 'express'
import { Prisma, User } from '@prisma/client'
import { string } from 'joi'
import { AuthDto } from './dto/auth.dto'
import { GetUser } from './decorator/get-user.decorator'
import { JwtRefreshGuard } from './guard/jwt-refresh.guard'
import { GetUserId } from './decorator/get-user-id.decorator'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('break point 5')
      const token = await this.authService.signIn(req.user)
      console.log('break point 6')
      return res.status(200).json({
        ...token,
      })
    } catch (error: any) {
      console.log(error)
      console.log('break point 7')
      throw new Error(error)
    }
  }

  @Post('login')
  @ApiBody({ description: 'tokenId for authentication', type: AuthDto })
  async login(@Body() data: AuthDto, @Res() res: Response): Promise<any> {
    try {
      const token = await this.authService.verifyGoogleToken(data)
      return res.status(200).json({
        ...token,
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }

  @ApiBearerAuth('JWT-Refresh-auth')
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(
    @GetUserId() userId: string,
    @GetUser('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const token = await this.authService.refreshTokens(userId, refreshToken)
      return res.status(200).json({
        ...token,
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  async logout(@GetUserId() userId: string, @Res() res: Response) {
    try {
      await this.authService.logout(userId)
      return res.status(200).json({
        message: 'Logout successfully',
      })
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
