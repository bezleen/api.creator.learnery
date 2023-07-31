import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
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
    switch (exception.code) {
      case 'P2002': {
        // https://www.prisma.io/docs/reference/api-reference/error-reference
        // unique constraint failed
        // const status = HttpStatus.CONFLICT
        const payload = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'DB_ERROR:Unique input fields required',
          error: message, // You can customize the error message based on your needs
        }

        console.error('DB:caught P2002 error')
        response.status(HttpStatus.CONFLICT).json(payload) //FIXME
        break
      }
      default:
        // default 500 error code
        // super.catch(exception, host)
        console.error('DB Error:', exception.code)
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database Error',
          error: message, // You can customize the error message based on your needs
        })
        break
    }
  }
}
// https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2
