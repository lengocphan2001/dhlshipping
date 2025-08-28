const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Validate required fields
    if (!updateData) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }

    // Fields that can be updated
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'gender',
      'bankName', 'accountNumber', 'accountHolderName'
    ];

    // Filter out non-allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        gender: true,
        bankName: true,
        accountNumber: true,
        accountHolderName: true,
        balance: true,
        creditScore: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        gender: true,
        bankName: true,
        accountNumber: true,
        accountHolderName: true,
        balance: true,
        creditScore: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  updateUserProfile,
  getUserProfile
};
