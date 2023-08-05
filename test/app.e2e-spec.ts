import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as pactum from 'pactum'
import { expect } from 'pactum'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../src/prisma/prisma.service'
import { AuthDto } from '../src/auth/dto'
import { ClerkService } from '../src/clerk/clerk.service'
import { ClerkClient } from '@clerk/clerk-sdk-node/dist/types/types'

describe('e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clerk: ClerkClient
  let url: string

  beforeAll(async () => {
    const ModuleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = ModuleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
    prisma = app.get<PrismaService>(PrismaService)
    clerk = app.get<ClerkService>(ClerkService).clerk
    const config = app.get<ConfigService>(ConfigService)
    const port = config.get('PORT')
    url = `http://localhost:${port}`
    await app.listen(port)
    pactum.request.setBaseUrl(url)
  })

  afterAll(async () => {
    await app.close()
    // await prisma.cleanDb()
  })

  describe('App', () => {
    it('should return home', () => {
      return pactum
        .spec()
        .get(url)
        .withRequestTimeout(1 * 1000) //cold start
        .expectStatus(HttpStatus.OK)
        .expectBodyContains({ message: 'app is up and running' })
        .inspect()
    })

    it('should return health status', () => {
      return pactum
        .spec()
        .get('/health')
        .withRequestTimeout(10 * 1000) //cold start for db
        .expectStatus(HttpStatus.OK)
        .expectJsonMatch('app', {
          ok: true,
          status: 'OK',
        })
        .expectJsonLike({
          db: {
            ok: true,
            status: 'OK',
          },
          app: {
            ok: true,
            status: 'OK',
          },
        })
    })
  })

  describe('Auth', function () {
    const user = {
      email: 'test@learnery.com',
      password: 'test@123',
    }

    describe('clerk', () => {
      it('sigin in via clerk', async () => {
        const users = await clerk.users.getUserList()

        const clerkUser = users.find(
          (u) => u.emailAddresses[0].emailAddress === user.email,
        )
        if (!clerkUser) {
          throw new Error('unable to sigin in clerk')
        }
        const session = await clerk.users.verifyPassword({
          ...user,
          userId: clerkUser.id,
        })
        expect(session.verified, true)
      })

      const dto: AuthDto = {
        clientToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkdmJfMlRaRHdzbUtzVUJvNmU2Vk8wMDVIZEY0d2htIn0.E5sLkHJsvg9XgadZgOablfZrEBHsAxnAwCr8R0UfImWp1Y4LkBelxx01zRfSxkgg3pTnOUJjFlzIb2_BYvXOsOeNHmmmqwOnu3LJcs_F2EpZgmyt1eh7p7tluo8taGjlG6r0z8gJ9rIOABVEe74XnGcCzfEnGMojosj-1YUDQe4n4XwMDm7eN40WAqJkDldfsrbCdMq3XyYs-sjxZby5PYCgT1RyDjnmmyjRTkjJ42U-lNQ95ufTHNajmUxtIHEzbSl71Jxj0zSMLveK4PnAlXD5skJisrGhOisO59M-IhdUbNuP6WeipmPaBeGZdW0MLksThesQ6A_V3M7XS89-Mg',
        sessionId: 'sess_2TZEKKoQGOtq7X0mndg7rlyl2cQ',
      }

      describe('Sign in', () => {
        it('should throw if clientToken empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              ...dto,
              clientToken: '',
            })
            .expectStatus(400)
            .inspect()
        })
        it('should throw if sessionId empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              ...dto,
              sessionId: '',
            })
            .expectStatus(400)
            .inspect()
        })
        it('should signin', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .stores('userToken', 'access_token')
            .expectCookiesLike('token')
        })
      })
    })

    describe('User', () => {
      describe('Get me', () => {
        it('should fail without header or cookies', () => {
          return pactum.spec().get('/users/me').expectStatus(401)
        })

        it('should get current user with Bearer Token', () => {
          return pactum
            .spec()
            .withHeaders({
              Authorization: `Bearer $S{userToken}`,
            })
            .get('/users/me')
            .expectStatus(200)
        })

        /* it('should get current user with cookies', () => {
            return (
              pactum
                .spec()
                .get('/users/me')
                .withCookies({
                  token: `$S{userId}`, //does'nt support store is passing as it is
                })
                .withCompression()
                .expectStatus(HttpStatus.OK)
                .inspect()
            )
          })*/
      })
    })
  })
})
