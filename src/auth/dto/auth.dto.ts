import { IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  clientToken: string

  @IsString()
  @IsNotEmpty()
  sessionId?: string
}
