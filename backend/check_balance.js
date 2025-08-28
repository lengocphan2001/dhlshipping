const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserBalances() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        balance: true
      }
    });
    
    console.log('Total users found:', users.length);
    console.log('All users:', JSON.stringify(users, null, 2));
    
    // Check if any users have balance
    const usersWithBalance = users.filter(user => user.balance && user.balance > 0);
    console.log('Users with non-zero balance:', usersWithBalance.length);
    
    // Show users with null or 0 balance
    const usersWithoutBalance = users.filter(user => !user.balance || user.balance === 0);
    console.log('Users without balance:', usersWithoutBalance.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserBalances();
