const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../lib/prisma');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Save token to database
const saveTokenToDatabase = async (userId, token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.userSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
};

// Remove token from database
const removeTokenFromDatabase = async (userId, token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  await prisma.userSession.deleteMany({
    where: {
      userId,
      tokenHash
    }
  });
};

// Clean expired tokens
const cleanExpiredTokens = async () => {
  await prisma.userSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Save password reset token
const savePasswordResetToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
};

// Verify password reset token
const verifyPasswordResetToken = async (token) => {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date()
      },
      used: false
    }
  });

  return resetToken;
};

// Mark password reset token as used
const markPasswordResetTokenAsUsed = async (token) => {
  await prisma.passwordResetToken.updateMany({
    where: { token },
    data: { used: true }
  });
};

// Check if username exists
const checkUsernameExists = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true }
  });
  return !!user;
};

// Check if email exists
const checkEmailExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
  return !!user;
};

// Check if referral code exists
const checkReferralCodeExists = async (referralCode) => {
  const user = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true }
  });
  return !!user;
};

// Get user by username
const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

// Get user by email
const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

// Get user by ID
const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      referralCode: true,
      referredBy: true,
      role: true,
      isActive: true,
      isVerified: true,
      balance: true,
      creditScore: true,
      bankName: true,
      accountNumber: true,
      accountHolderName: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

module.exports = {
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
};
