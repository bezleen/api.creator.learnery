import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import metadata from './metadata'
import { initApp } from './initApp'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await SwaggerModule.loadPluginMetadata(metadata)
  const document = AppModule.createDocument(app)
  SwaggerModule.setup('api', app, document)

  await initApp(app)

  const config = app.get<ConfigService>(ConfigService)

  const port = config.get('PORT')
  console.log(`App is running on ${port}`)
  await app.listen(port)
}
bootstrap()
