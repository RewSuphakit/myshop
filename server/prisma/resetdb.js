const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database myshop')
  await prisma.$executeRawUnsafe('CREATE Database myshop')
}
console.log('Done Reset DB!!')
run()