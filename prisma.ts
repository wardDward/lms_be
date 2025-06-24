import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
 await prisma.user.create({
    data: {
      name: 'Rich',
    },
  })
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })