import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { GqlExceptionFilter, GraphQLArgumentsHost } from '@nestjs/graphql'

@Catch(PrismaClientUnknownRequestError, PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
  extends BaseExceptionFilter
  implements GqlExceptionFilter
{
  catch(
    exception: Prisma.PrismaClientKnownRequestError | PrismaClientKnownRequestError,
    host: ArgumentsHost | GraphQLArgumentsHost,
  ) {
    console.error(exception.message)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // const message = exception.message.replace(/\n/g, '')
    const message = exception.message
    console.error('DB Error:', exception.code)
    // response?.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //   message: 'Database Error',
    //   error: message, // You can customize the error message based on your needs
    // })

    throw new ConflictException({
      message: 'Database Error',
      error: message, // You can customize the error message based on your needs
    })
  }
}

// https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2
// https://www.prisma.io/docs/reference/api-reference/error-reference
