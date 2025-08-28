const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBalanceToUser() {
  try {
    // Get the first user
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        balance: true
      }
    });
    
    if (!user) {
      console.log('No users found in database');
      return;
    }
    
    console.log('Current user:', user);
    
    // Add 1,000,000 VND balance to the user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { balance: 1000000 },
      select: {
        id: true,
        username: true,
        balance: true
      }
    });
    
    console.log('Updated user with balance:', updatedUser);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBalanceToUser();
