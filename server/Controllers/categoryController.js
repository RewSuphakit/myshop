const prisma = require('../models/db');

// Controller function to list categories with search query
exports.listCategories = async (req, res) => {
    try {
        const { search } = req.query;
        let categories;
        if (search) {
            categories = await prisma.category.findMany({
                where: {
                    OR: [
                        { name: { contains: search } },
                        { description: { contains: search } }
                    ]
                }
            });
        } else {
            categories = await prisma.category.findMany();
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to create a new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = await prisma.category.create({
            data: {
                name,
                description
            }
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to update a category
exports.updateCategory = async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;

    try {
        const updatedCategory = await prisma.category.update({
            where: {
                category_id: categoryId
            },
            data: {
                name,
                description
            }
        });
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete a category
exports.removeCategory = async (req, res) => {
    const categoryId = parseInt(req.params.id);

    try {
        await prisma.category.delete({
            where: {
                category_id: categoryId
            }
        });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
