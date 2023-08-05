import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { AuthDto } from './dto'

import { Response } from 'express'

@Controller('auth')
@ApiTags('Authentication') // Add a tag to categorize the APIs
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' }) // Add an operation description
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
    type: Object,
  }) // Add a response description with the return type
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' }) // Add another response description
  async signin(@Body() dto: AuthDto, @Res() res: Response) {
    const token = await this.authService.signin(dto)

    res.clearCookie('token')
    res.cookie('token', token.access_token, {
      maxAge: this.config.get<number>('JWT_EXPIRATION_TIME') || 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      // signed: true,
    })

    res.send(token)
  }
}
