import { Catch, ExceptionFilter, Logger } from '@nestjs/common'

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter')

  catch(exception: Error) {
    this.logger.error('Unhandled exception occurred', exception)

    // Handle the error as per your application's requirements (e.g., logging, notifying, graceful shutdown)
    // process.exit(1) // Exit the application //FIXME stalling in graphql
  }
}
