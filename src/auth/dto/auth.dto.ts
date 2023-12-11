import { IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  tokenId: string
}

export class JwtDto {
  @IsString()
  @IsNotEmpty()
  sub: string

  @IsString()
  @IsNotEmpty()
  email: string
}
