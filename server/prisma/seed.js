const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed  category
  await prisma.category.createMany({
    data: [
      { name: 'Phones' },
      { name: 'Computer' },
      { name: 'SmartWatch' },
      { name: 'Camera' },
      { name: 'HeadPhones' },
      { name: 'Gaming' }
    ]
  });

  // Create hashed password
  const password = '123456';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        first_name: 'aaa',
        last_name: 'aaa',
        email: 'aaa@gmail.com',
        password: hashedPassword,
        role: 'User',
      },
      {
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'Admin',
      }
    ],
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
