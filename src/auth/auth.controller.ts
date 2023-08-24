import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { AuthDto } from './dto'

import { Request, Response } from 'express'

@Controller('auth')
@ApiTags('Authentication') // Add a tag to categorize the APIs
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' }) // Add an operation description
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
    type: Object,
  }) // Add a response description with the return type
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' }) // Add another response description
  async signin(@Body() dto: AuthDto, @Res() res: Response, @Req() req: Request) {
    // TODO: https://docs.nestjs.com/techniques/session
    const token = await this.authService.signin(dto)

    const cookieName = this.config.get('COOKIE_NAME')
    const cookiePath = this.config.get('DOMAIN_PATH')
    res.clearCookie(cookieName, { path: cookiePath })

    console.log('signin: setting cookie for', req.ip)

    res.cookie(cookieName, token.access_token, {
      path: cookiePath,
      domain: this.config.get('DOMAIN'),
      maxAge: this.config.get<number>('JWT_MAX_AGE'),
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      signed: true, //FIXME: sign cookies in future
    })

    res.cookie(cookieName, token.access_token, {
      //FIXME: if this works, appolo sandbox its workign
      path: cookiePath,
      domain: this.config.get('DOMAIN'),
      maxAge: this.config.get<number>('JWT_MAX_AGE'),
      secure: false,
      httpOnly: true,
      sameSite: 'none',
      signed: true, //FIXME: sign cookies in future
    })
    res.send(token)
  }
}
