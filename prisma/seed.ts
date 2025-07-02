import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
    const user_roles = await prisma.role.createMany({
        data: [
            { name: 'learner', description: "learner" },
            { name: 'instructor', description: "instructor" },
            { name: "admin", description: "admin" }
        ],
    })

    console.log(user_roles)
}


main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})