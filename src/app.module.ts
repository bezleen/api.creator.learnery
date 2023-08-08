import { INestApplication, Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import Joi from 'joi'
import { CacheModule } from '@nestjs/cache-manager'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'
import { GraphQLDateTime } from 'graphql-iso-date'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { AppController } from './app.controller'
import { GraphqlContext } from './app.dto'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { CategoryController } from './category/category.controller'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CategoryModule } from './category/category.module'
import { UserController } from './user/user.controller'
import { AuthController } from './auth/auth.controller'
import { CategoryService } from './category/category.service'
import { UserService } from './user/user.service'
import { AuthService } from './auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { ClerkModule } from './clerk/clerk.module'
import { ClerkService } from './clerk/clerk.service'
import { AudienceModule } from './audience/audience.module'
import { CourseModule } from './course/course.module'

let mode = process.env.MODE
let envFile: string

switch (mode) {
  case 'test':
    envFile = '.env.test'
    process.env.NODE_ENV = 'testing'
    break
  case 'prod':
    process.env.NODE_ENV = 'production'
    envFile = '.env.prod'
    break
  case 'dev':
    mode = 'dev'
    process.env.NODE_ENV = 'development'
    envFile = '.env.local'
    break
}

console.debug({ mode, envFile })

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envFile, '.env.local'], //by default looks for .env file in root directory
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        MODE: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number().default(1606),
        DATABASE_URL: Joi.string(),
        JWT_SECRET: Joi.string().default('Hiro@JWT#TOKEN$'),
        JWT_MAX_AGE: Joi.number().default(2 * 60 * 60 * 1000),
        CLERK_SECRET_KEY: Joi.string().required(),
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }: GraphqlContext) => ({ req, res }), //required for cookies

      fieldResolverEnhancers: ['interceptors'], //FIXME:unsure

      autoSchemaFile: false, // schema-first
      playground: false,
      driver: ApolloDriver,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: GraphQLDateTime },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ClerkModule,
    AudienceModule,
    CourseModule,
  ],
  controllers: [AppController, CategoryController, UserController, AuthController],
  providers: [
    AppService,
    CategoryService,
    UserService,
    AuthService,
    JwtService,
    ClerkService,
  ],
})
export class AppModule {
  static createDocument(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('Learnery Creator APIs')
      .setDescription('apis to crud courses')
      .setVersion('1.0')
      .addTag('learnery-creator')
      .addBearerAuth()
      .addCookieAuth('token')
      .build()
    return SwaggerModule.createDocument(app, options)
  }
}
