import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger()

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req
    const start = new Date().getTime()

    res.on('finish', () => {
      const elapsed = new Date().getTime() - start
      const msg = `${ip} ${method} ${originalUrl} ${res.statusCode} ${elapsed}ms`
      this.logger.log(msg)
    })

    next()
  }
}
