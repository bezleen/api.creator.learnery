import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

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

export class localAuthDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class registerDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  avatar: string
}
