const prisma = require('../models/db')
const PAGE_SIZE = 20; 
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

    if (req.query.sort === 'desc') {
      query = {
        ...query,
        orderBy: {
          created_at: 'desc' 
        }
      };
    }

    if (req.query.category) {
      const categoryId = parseInt(req.query.category);
      query = {
        ...query,
        where: {
          Category_id: categoryId 
        }
      };
    }

    let products = await prisma.products.findMany(query);
    
    products = products.map(product => {
      return {
        ...product,
        image: product.image ? `http://localhost:8000/${product.image.replace(/\\/g, '/')}` : null
      };
    });

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
        Category: true 
      }
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }


    const productWithCorrectedImageURL = {
      ...product,
      image: product.image ? `http://localhost:8000/${product.image.replace(/\\/g, '/')}` : null
    };

    res.json(productWithCorrectedImageURL);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } finally {
    await prisma.$disconnect();
  }
};
// Your create function
exports.create = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Price is required and must be a number' });
    }

    if (!stock_quantity || isNaN(stock_quantity)) {
      return res.status(400).json({ error: 'Stock quantity is required and must be a number' });
    }

    if (category_id === null) {
      return res.status(400).json({ error: 'Category is required' });
    }

    let image = null;
    if (req.file) {
      image = await resizeImage(req, res);
    }

    const newProduct = await prisma.products.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        Category_id: parseInt(category_id), 
        image: image
      }
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error: Failed to create product' });
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
