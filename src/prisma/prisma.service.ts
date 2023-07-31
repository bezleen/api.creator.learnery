import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import kleur from 'kleur'
import { format } from 'sql-formatter'

const logEvents: Prisma.LogDefinition[] = [
  {
    emit: 'event',
    level: 'query',
  },
  {
    emit: 'stdout',
    level: 'error',
  },
  {
    emit: 'stdout',
    level: 'info',
  },
  {
    emit: 'stdout',
    level: 'warn',
  },
]

let DB_CONNECTED = false

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // FIXME doesn't work for e2e OnModuleDestroy{
  // https://docs.nestjs.com/fundamentals/lifecycle-events

  constructor(config: ConfigService) {
    const sslcert = '?sslcert=root.crt'
    //https://www.prisma.io/docs/concepts/database-connectors/postgresql#configuring-an-ssl-connection
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL') + sslcert,
        },
      },
      log: logEvents,
    })

    process.env.FORCE_COLOR = 'true'

    // @ts-ignore
    this.$on('query', async (e: any) => {
      if (config.get<string>('MODE') != 'dev') {
        return
      }

      // const chalk = await import('chalk')
      // console.log(chalk.yellow('Query: ') + chalk.green(e.query))
      // console.log(chalk.yellow('Params: ') + chalk.cyan(JSON.stringify(e.params)))
      // console.log(chalk.yellow('Duration: ') + chalk.magenta(`${e.duration}ms`))
      const query = e.query

      const formattedQuery = format(query, {
        language: 'postgresql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
        params: e.params || [],
      })
      console.log(kleur.yellow('Query: ') + kleur.green(formattedQuery))
      console.log(kleur.yellow('Params: ') + kleur.cyan(JSON.stringify(e.params)))
      console.log(kleur.yellow('Duration: ') + kleur.magenta(`${e.duration}ms`))
    })
  }
  async onModuleInit() {
    if (DB_CONNECTED) return

    console.info(new Date(), 'connecting to the database')
    await this.$connect()
    await this.$executeRawUnsafe("SET timezone = 'Asia/Kolkata'")

    DB_CONNECTED = true
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }

  cleanDb() {
    return this.$transaction([
      //tear down logic
      this.user.deleteMany(),
    ])
  }
}
