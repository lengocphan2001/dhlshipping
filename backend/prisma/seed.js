const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@dhlshipping.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      referralCode: 'ADMIN001'
    },
  });

  // Create sample user
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@dhlshipping.com',
      passwordHash: userPassword,
      firstName: 'Sample',
      lastName: 'User',
      role: 'USER',
      isVerified: true,
      isActive: true,
      referralCode: 'USER001'
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user created:', admin.username);
  console.log('👤 Sample user created:', user.username);
  console.log('🔑 Admin password: admin123');
  console.log('🔑 User password: user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
