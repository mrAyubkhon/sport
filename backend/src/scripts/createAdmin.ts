import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@sportachievements.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@sportachievements.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN',
        bio: 'System Administrator - Can view all users and manage the system',
        age: 30
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@sportachievements.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: ADMIN');
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
