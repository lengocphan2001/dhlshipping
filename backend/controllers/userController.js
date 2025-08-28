const { prisma } = require('../lib/prisma');
const { getUserById } = require('../utils/auth');

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
        { accountHolderName: { contains: search } }
      ];
    }

    if (role) {
      where.role = role;
    }

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        balance: true,
        creditScore: true,
        bankName: true,
        accountNumber: true,
        accountHolderName: true,
        role: true,
        isActive: true,
        isVerified: true,
        referralCode: true,
        referredBy: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    // Get total count
    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user by ID (for admin)
const getUserByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        balance: true,
        creditScore: true,
        bankName: true,
        accountNumber: true,
        accountHolderName: true,
        role: true,
        isActive: true,
        isVerified: true,
        referralCode: true,
        referredBy: true,
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
      data: { user }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user (for admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const {
      firstName,
      lastName,
      email,
      phone,
      balance,
      creditScore,
      bankName,
      accountNumber,
      accountHolderName,
      role,
      isActive,
      isVerified
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phone,
        balance: balance !== undefined ? parseFloat(balance) : undefined,
        creditScore: creditScore !== undefined ? parseInt(creditScore) : undefined,
        bankName,
        accountNumber,
        accountHolderName,
        role,
        isActive,
        isVerified
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        balance: true,
        creditScore: true,
        bankName: true,
        accountNumber: true,
        accountHolderName: true,
        role: true,
        isActive: true,
        isVerified: true,
        referralCode: true,
        referredBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user (for admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user balance (for admin)
const updateUserBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { balance, operation = 'add' } = req.body; // Changed default to 'add'
    
    // Check if balance field is missing
    if (balance === undefined) {
      console.log('Balance field is missing from request body');
      return res.status(400).json({
        success: false,
        message: 'Balance field is required',
        debug: {
          body: req.body,
          bodyKeys: Object.keys(req.body),
          hasBalance: 'balance' in req.body
        }
      });
    }

    console.log('UpdateUserBalance Debug:', {
      userId,
      balance,
      operation,
      body: req.body,
      bodyKeys: Object.keys(req.body),
      balanceType: typeof balance,
      balanceValue: balance,
      headers: req.headers['content-type'],
      rawBody: JSON.stringify(req.body)
    });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let newBalance;
    
    // Handle different input types
    let balanceValue;
    if (typeof balance === 'string') {
      balanceValue = parseFloat(balance);
    } else if (typeof balance === 'number') {
      balanceValue = balance;
    } else if (balance === null || balance === undefined) {
      balanceValue = 0;
    } else {
      balanceValue = parseFloat(balance);
    }
    
    const currentBalance = parseFloat(existingUser.balance) || 0;

    console.log('Balance calculation:', {
      currentBalance,
      balanceValue,
      operation,
      existingUserBalance: existingUser.balance,
      balanceType: typeof balance,
      currentBalanceType: typeof existingUser.balance,
      balanceValueType: typeof balanceValue,
      balanceIsNull: balance === null,
      balanceIsUndefined: balance === undefined
    });

    // Check if balanceValue is valid
    if (isNaN(balanceValue)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit amount - not a valid number',
        debug: {
          balance,
          balanceType: typeof balance,
          balanceValue,
          balanceValueType: typeof balanceValue
        }
      });
    }
    
    if (balanceValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit amount - must be a positive number',
        debug: {
          balance,
          balanceValue
        }
      });
    }

    switch (operation) {
      case 'add':
        newBalance = currentBalance + balanceValue;
        break;
      case 'subtract':
        newBalance = currentBalance - balanceValue;
        break;
      case 'set':
        newBalance = balanceValue;
        break;
      default:
        newBalance = currentBalance + balanceValue; // Default to add
        break;
    }

    console.log('New balance calculated:', newBalance, 'Type:', typeof newBalance);

    // Ensure newBalance is a valid number
    if (isNaN(newBalance)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid balance value',
        debug: {
          currentBalance,
          balanceValue,
          operation,
          newBalance
        }
      });
    }

    // Update balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
      select: {
        id: true,
        username: true,
        balance: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User balance updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserByIdAdmin,
  updateUser,
  deleteUser,
  updateUserBalance
};
