const prisma = require('../models/db');

exports.listReviews = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const reviews = await prisma.reviews.findMany({
            where: {
                product_id: productId
            },
            include: {
                user: true
            }
        });
        res.status(200).json({ reviews });
    } catch (err) {
        console.error('Error listing reviews:', err);
        next(err);
    }
};

exports.addReview = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const { userId, rating, comment } = req.body;

        // Validate required fields and data types
        if (!userId || !productId || !rating || !comment ||
            isNaN(parseInt(userId)) || isNaN(parseInt(productId)) || isNaN(parseFloat(rating))) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Create new review
        const newReview = await prisma.reviews.create({
            data: {
                rating: parseFloat(rating),
                comment: comment,
                product_id: productId,
                user_id: parseInt(userId),
            }
        });

        res.status(201).json({ review: newReview });
    } catch (error) {
        console.error('Error adding review:', error);
        next(error);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const  review_id  = req.params.id;
        const { rating, comment } = req.body;

        const updatedReview = await prisma.reviews.update({
            where: { review_id: parseInt(review_id) },
            data: { rating, comment }
        });

        res.status(200).json({ review: updatedReview });
    } catch (err) {
        console.error('Error updating review:', err);
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const  review_id  = req.params.id;
        await prisma.reviews.delete({ where: { review_id: parseInt(review_id) } });
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting review:', err);
        next(err);
    }
};