import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter'
import { SwaggerModule } from '@nestjs/swagger'
import metadata from './metadata'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await SwaggerModule.loadPluginMetadata(metadata)
  const document = AppModule.createDocument(app)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe({ whitelist: false })) //whitelist: true FAILS cuz graphql generated classes has no class validator decorators hence returns a empty {}

  const config = app.get<ConfigService>(ConfigService)
  app.enableShutdownHooks()

  app.use(cookieParser(config.get('JWT_SECRET')))
  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'surge.sh',
      'github.io',
      'vercel.app',
      'localhost',
      '*',
    ],
    credentials: true,
  })
  app.useGlobalFilters(new PrismaClientExceptionFilter())
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Accept-Version',
  })

  app.use(
    compression({
      threshold: 512, // only responses exceeding 512 bytes will be compressed
    }),
  )

  const port = config.get('PORT')
  console.log(`App is running on ${port}`)

  await app.listen(port)
}
bootstrap()
