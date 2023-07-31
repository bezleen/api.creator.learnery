import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Res() res: Response) {
    const token = await this.authService.signin(dto)

    res.clearCookie('token')
    res.cookie('token', token.access_token, {
      maxAge: this.config.get('JWT_SECRET') * 1000 || 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      // signed: true,
    })

    res.send(token)
  }
}
