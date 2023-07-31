import { PrismaClient } from '@prisma/client'
import argon from 'argon2'
import { AuthDto } from '../src/auth/dto'

const prisma = new PrismaClient()

async function create_user(dto: AuthDto) {
  const hash = await argon.hash(dto.password)
  const user = await prisma.user.create({
    data: {
      email: dto.email,
      hash: hash,
    },
  })
  console.log({ created: user })
  return user
}

async function main() {
  await prisma.user.deleteMany()

  const hiro = await create_user({
    email: 'hiro@nas.com',
    password: 'hiro@Nas@@@@#',
  })

  console.debug({ hiro })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
