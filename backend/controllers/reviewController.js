const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all reviews with pagination and filters
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, productId, isApproved, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(productId && { productId: parseInt(productId) }),
      ...(isApproved !== undefined && { isApproved: isApproved === 'true' }),
      ...(userId && { userId: parseInt(userId) })
    };

    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.productReview.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await prisma.productReview.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
};

// Create new review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, tags } = req.body;
    const userId = req.user.id;

    // Allow multiple reviews per user per product
    const review = await prisma.productReview.create({
      data: {
        productId: parseInt(productId),
        userId: parseInt(userId),
        rating: parseInt(rating),
        comment,
        isApproved: true // Set to true so review appears immediately
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, isApproved } = req.body;

    const review = await prisma.productReview.update({
      where: { id: parseInt(id) },
      data: {
        rating: rating ? parseInt(rating) : undefined,
        comment,
        isApproved: isApproved !== undefined ? isApproved : undefined
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.productReview.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

// Approve/Reject review
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.productReview.update({
      where: { id: parseInt(id) },
      data: { isApproved },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: review,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review'
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  approveReview
};
