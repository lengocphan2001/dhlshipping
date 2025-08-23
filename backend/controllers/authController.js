const {
  generateToken,
  hashPassword,
  comparePassword,
  generateReferralCode,
  saveTokenToDatabase,
  removeTokenFromDatabase,
  cleanExpiredTokens,
  generatePasswordResetToken,
  savePasswordResetToken,
  verifyPasswordResetToken,
  markPasswordResetTokenAsUsed,
  checkUsernameExists,
  checkEmailExists,
  checkReferralCodeExists,
  getUserByUsername,
  getUserByEmail,
  getUserById
} = require('../utils/auth');

const { prisma } = require('../lib/prisma');

// Register new user
const register = async (req, res) => {
  try {
    const { username, password, email, referralCode } = req.body;

    // Check if username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check if referral code exists (if provided)
    let referredBy = null;
    if (referralCode) {
      const referralExists = await checkReferralCodeExists(referralCode);
      if (!referralExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
      referredBy = referralCode;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate unique referral code
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const exists = await checkReferralCodeExists(newReferralCode);
      if (!exists) {
        isUnique = true;
      }
    }

    // Insert new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        referralCode: newReferralCode,
        referredBy
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Save token to database
    await saveTokenToDatabase(user.id, token);

    // Get user data (without password)
    const userData = await getUserById(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user by username
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Save token to database
    await saveTokenToDatabase(user.id, token);

    // Clean expired tokens
    await cleanExpiredTokens();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          referralCode: user.referralCode,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await removeTokenFromDatabase(req.user.id, token);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
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
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phone
      }
    });

    // Get updated user data
    const user = await getUserById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    // Remove all existing sessions for this user
    await prisma.userSession.deleteMany({
      where: { userId }
    });

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();

    // Save reset token
    await savePasswordResetToken(user.id, resetToken);

    // In a real application, you would send an email here
    // For now, we'll just return the token (in production, remove this)
    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      data: {
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      }
    });

  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const resetTokenData = await verifyPasswordResetToken(token);
    if (!resetTokenData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: resetTokenData.userId },
      data: { passwordHash: newPasswordHash }
    });

    // Mark token as used
    await markPasswordResetTokenAsUsed(token);

    // Remove all existing sessions for this user
    await prisma.userSession.deleteMany({
      where: { userId: resetTokenData.userId }
    });

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword
};
