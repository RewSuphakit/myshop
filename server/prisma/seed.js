// seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Products
  await prisma.products.createMany({
    data: [
      {
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 19.99,
        stock_quantity: 50,
        image: 'product1.jpg',
      },
      {
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 29.99,
        stock_quantity: 30,
        image: 'product2.jpg',
      },
      {
        name: 'Product 4',
        description: 'Description for Product 4',
        price: 49.99,
        stock_quantity: 40,
        image: 'product4.jpg',
      },
      {
        name: 'Product 5',
        description: 'Description for Product 5',
        price: 59.99,
        stock_quantity: 20,
        image: 'product5.jpg',
      },
      {
        name: 'Product 4',
        description: 'Description for Product 4',
        price: 49.99,
        stock_quantity: 40,
        image: 'product4.jpg',
      },
      {
        name: 'Product 6',
        description: 'Description for Product 5',
        price: 59.99,
        stock_quantity: 20,
        image: 'product5.jpg',
      },
      
      {
        name: 'Product 7',
        description: 'Description for Product 4',
        price: 49.99,
        stock_quantity: 40,
        image: 'product4.jpg',
      },
      {
        name: 'Product 8',
        description: 'Description for Product 5',
        price: 59.99,
        stock_quantity: 20,
        image: 'product5.jpg',
      },
      
      {
        name: 'Product 9',
        description: 'Description for Product 4',
        price: 49.99,
        stock_quantity: 40,
        image: 'product4.jpg',
      },
      {
        name: 'Product 10',
        description: 'Description for Product 5',
        price: 59.99,
        stock_quantity: 20,
        image: 'product5.jpg',
      },
      
      {
        name: 'Product 11',
        description: 'Description for Product 4',
        price: 49.99,
        stock_quantity: 40,
        image: 'product4.jpg',
      },
      {
        name: 'Product 12',
        description: 'Description for Product 5',
        price: 59.99,
        stock_quantity: 20,
        image: 'product5.jpg',
      },
      
      
    ],
  });

  // Seed Users
  await prisma.users.createMany({
    data: [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword1',
        role: 'User',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'hashedpassword2',
        role: 'Admin',
      },
      // Add more users as needed
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
