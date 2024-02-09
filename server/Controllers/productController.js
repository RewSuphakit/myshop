const prisma = require('../models/db')
const PAGE_SIZE = 20; // จำนวนรายการต่อหน้า

exports.list = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      let query = {
          skip,
          take,
          include: {
              Category: true
          }
      };
// Check if sort query parameter is provided
if (req.query.sort === 'desc') {
  query = {
      ...query,
      orderBy: {
          created_at: 'desc' // เรียงลำดับตาม created_at ในลำดับที่ตรงกันกับที่ระบุ
      }
  };
}

      // Check if category query parameter is provided
      if (req.query.category) {
          const categoryId = parseInt(req.query.category);
          query = {
              ...query,
              where: {
                  Category_id: categoryId // แก้ไขชื่อฟิลด์เป็น Category_id
              }
          };
      }

      const products = await prisma.products.findMany(query);

      res.json(products);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  } finally {
      await prisma.$disconnect();
  }
};
exports.read = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.products.findUnique({
      where: { product_id: productId },
      include: {
        Category: true // Include the Category information
      }
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, image } = req.body;
    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock_quantity,
        image,
      },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.update = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock_quantity, image } = req.body;
    const updatedProduct = await prisma.products.update({
      where: { product_id: productId },
      data: {
        name,
        description,
        price,
        stock_quantity,
        image,
      },
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};

exports.remove = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.products.delete({
      where: { product_id: productId },
    });

    res.send(`Product with ID ${productId} has been deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};
