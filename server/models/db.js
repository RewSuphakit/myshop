// db.js
// สร้างการเชื่อมต่อ Prisma ที่เรียกใช้เพียงครั้งเดียว
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ตัวอย่างการใช้งาน Prisma ในฟังก์ชันหรือการดำเนินการต่างๆ
async function fetchData() {
  try {
    const data = await prisma.someModel.findMany();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// ตัวอย่างการปิดการเชื่อมต่อ Prisma เมื่อไม่ได้ใช้งาน
async function closePrismaConnection() {
  await prisma.$disconnect();
}

module.exports = prisma;
