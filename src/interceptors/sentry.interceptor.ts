import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import * as Sentry from '@sentry/node'
import { Observable, catchError, throwError } from 'rxjs'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err: any) => {
        Sentry.captureException(err)
        return throwError(err)
      }),
    )
  }
}
