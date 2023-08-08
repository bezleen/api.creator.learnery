import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      clerkId: 'user_2TZEa6GRDF2TBEk0lh1Z6nwYXlg',
    },
  })
  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
