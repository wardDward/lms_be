import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      firstname: 'Rich',
      lastname  : 'Test',
      email     : 'test@test.com',
      password  : 'password',
      age       : 18,
      birth_day : '2024-12-14',
      contact   : '+6393493924',
      gender    :   'Male',
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