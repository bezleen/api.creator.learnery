import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import {
  CorsOptions,
  CorsOptionsCallback,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface'
import { PrismaClientExceptionFilter } from './app/exceptions/prisma-client-exception.filter'
import session from 'express-session'
import requestIp from 'request-ip'
import compression from 'compression'

export async function initApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: false })) //whitelist: true FAILS cuz graphql generated classes has no class validator decorators hence returns a empty {}

  const config = app.get<ConfigService>(ConfigService)
  app.enableShutdownHooks()

  app.use(cookieParser(config.get('JWT_SECRET')))
  const whitelist = [
    'https://studio.apollographql.com',
    'http://surge.sh',
    'https://github.io',
    'https://vercel.app',
    'http://localhost', //FIXME: doesn't seem to work
    'http://localhost:3000',
    'https://learnery.network',
    'https://*.vercel.app',
    'https://creator-learnery-6ale8ywlx-laciferin.vercel.app',
    '*', //TODO: check if this is needed
  ]
  let corsOptions: CorsOptions | CorsOptionsDelegate<any> | CorsOptionsCallback = {
    origin: (origin, callback) => {
      origin = origin ?? '*'
      // if (!origin){
      //   callback(null, true) //its okay
      // }
      console.debug({ origin })

      // let u = new URL(origin)
      //
      // console.debug({ host: u.hostname })

      if (whitelist.includes(origin) || true) {
        //TODO: break circuit
        return callback(null, true)
      }
      callback(new Error('cors: failed'), false)
    },
    credentials: true,
    allowedHeaders: ['content-type', 'authorization', 'Accept-Version'],
    exposedHeaders: ['*'],
    preflightContinue: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    optionsSuccessStatus: 200, //204 No content
  }
  // corsOptions= { //FIXME: not working
  //   origin: whitelist ,

  //   credentials: true,
  // }
  // app.enableCors(corsOptions)

  // app.use(cors())
  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'http://localhost:3000',
      'https://vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
    // optionsSuccessStatus: 200,
    // preflightContinue: true,
  })
  app.useGlobalFilters(new PrismaClientExceptionFilter())
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Accept-Version',
  })
  app.use(
    session({
      // genid: function(req) { //TODO:
      //   return genuuid()  // use UUIDs for session IDs
      // },
      cookie: {
        path: '/apiLearnery',
        httpOnly: true,
        secure: true,
        maxAge: null,
        sameSite: 'none',
      },
      secret: config.get('JWT_SECRET'),
      resave: true, //TODO:
      rolling: true, //TODO
      saveUninitialized: true,
    }),
  )
  app.use(requestIp.mw())

  app.use(
    compression({
      threshold: 512, // only responses exceeding 512 bytes will be compressed
    }),
  )
}
