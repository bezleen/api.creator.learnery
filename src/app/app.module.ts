import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import Joi from 'joi'
import { CacheModule } from '@nestjs/cache-manager'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'
import { GraphQLDateTime } from 'graphql-iso-date'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { AppController } from './app.controller'
import { GraphqlContext } from './dto/request.dto'
import { UserModule } from '../user/user.module'
import { PrismaModule } from '../prisma/prisma.module'
import { CategoryController } from '../category/category.controller'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CategoryModule } from '../category/category.module'
import { UserController } from '../user/user.controller'
import { AuthController } from '../auth/auth.controller'
import { CategoryService } from '../category/category.service'
import { UserService } from '../user/user.service'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { ClerkModule } from '../clerk/clerk.module'
import { ClerkService } from '../clerk/clerk.service'
import { AudienceModule } from '../audience/audience.module'
import { CourseModule } from '../course/course.module'
import { HttpLoggerMiddleware } from './middlewares/http-logger.middleware'
import { AiModule } from '../ai/ai.module'
import { AiService } from '../ai/ai.service'
import { PineconeService } from '@src/ai/pinecone/pinecone.service'
import { APP_FILTER } from '@nestjs/core'
import { GlobalExceptionFilter } from '@app/exceptions/global-exception.filter'
import { OpenAIService } from '@src/ai/openai/openAIService'

let mode = process.env.MODE
let envFile: string

let cookieName: string

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
        JWT_MAX_AGE: Joi.number()
          .default(Number.MAX_SAFE_INTEGER - 1) //2 * 60 * 60 * 1000)
          .max(Number.MAX_SAFE_INTEGER - 1)
          .min(60 * 1000),
        CLERK_SECRET_KEY: Joi.string().required().min(10),
        DOMAIN: Joi.string().optional().default(''),
        COOKIE_PATH: Joi.string().optional().default('/').min(1),
        COOKIE_NAME: Joi.string().optional().default('token').min(2),
        OPENAI_API_KEY: Joi.string().required().min(20), //FIXME: change length
        PINECONE_API_KEY: Joi.string().required().min(30),
        PINECONE_API_ENV: Joi.string().required().min(7),
        PINECONE_INDEX: Joi.string().optional().default('learnery'),
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res, connection }: GraphqlContext) => {
        /*if (connection) { //DOesn't work
          // This is a WebSocket connection
          console.log({connection})
          return { req: connection.context.req, res: connection.context.res };
        }
        // This is an HTTP request*/
        return { req, res }
      }, //required for cookies
      introspection: true, //mode!='prod',//FIXME: disable in production
      fieldResolverEnhancers: ['interceptors'], //FIXME:unsure
      installSubscriptionHandlers: true,

      // https://docs.escape.tech/cookbooks/enabling-introspection#:~:text=The%20package%20is%20a%20wrapper,in%20the%20NestJS%20related%20documentation.&text=By%20default%2C%20the%20introspection%20is,true%20in%20the%20module%20declaration.
      autoSchemaFile: false, // schema-first
      playground: false,
      driver: ApolloDriver,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: GraphQLDateTime },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        // 'graphql-ws': true,
        'subscriptions-transport-ws': true,

        /* 'subscriptions-transport-ws': {
          onConnect: (
            connectionParams: any,
            websocket: any,
            ctx: any,
          ): GraphqlContext => {
            console.log({ req: ctx.req });
            return { req: ctx.req, res: ctx.res };
            // console.log({ req: ctx.connection.context.req })
            return { req: ctx.connection.context.req, res: ctx.connection.context.res }
          },
        },*/
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ClerkModule,
    AudienceModule,
    CourseModule,
    AiModule,
  ],
  controllers: [AppController, CategoryController, UserController, AuthController],
  providers: [
    {
      provide: APP_FILTER, //FIXME; not working try with invalid pinecone cred
      useClass: GlobalExceptionFilter,
    },
    AppService,
    CategoryService,
    UserService,
    AuthService,
    JwtService,
    ClerkService,
    OpenAIService,
    PineconeService,
    AiService,
  ],
})
export class AppModule implements OnModuleInit, NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*')
  }
  constructor(private readonly config: ConfigService) {
    /*cookieName = config.get('COOKIE_NAME')
    console.debug({"SET-COOKIE": cookieName})*/
  }

  onModuleInit() {
    cookieName = this.config.get('COOKIE_NAME')
    console.debug({ 'SET-COOKIE': cookieName })
  }

  static createDocument(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('Learnery Creator APIs')
      .setDescription('apis to crud courses')
      .setVersion('1.0')
      .addTag('learnery-creator')
      .addBearerAuth()
      .addCookieAuth(cookieName)
      .build()
    return SwaggerModule.createDocument(app, options)
  }
}
