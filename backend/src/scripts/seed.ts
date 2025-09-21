import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt';

const prisma = new PrismaClient();

const achievementTypes = ['running', 'swimming', 'cycling', 'custom'];
const customActivities = ['Push-ups', 'Pull-ups', 'Squats', 'Plank', 'Yoga'];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.notification.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.friendship.deleteMany();
    await prisma.friendRequest.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleared existing data');

    // Create users
    const users = [];
    const userCount = 10;

    for (let i = 1; i <= userCount; i++) {
      const hashedPassword = await hashPassword('password123');
      const user = await prisma.user.create({
        data: {
          email: `user${i}@example.com`,
          password: hashedPassword,
          name: `User ${i}`,
          age: 20 + (i % 40),
          bio: `This is the bio for User ${i}. I love sports and staying active!`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
        },
      });
      users.push(user);
    }

    console.log(`👥 Created ${users.length} users`);

    // Create friendships
    const friendships = [];
    for (let i = 0; i < users.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 3, users.length); j++) {
        const friendship = await prisma.friendship.create({
          data: {
            user1Id: users[i].id,
            user2Id: users[j].id,
          },
        });
        friendships.push(friendship);
      }
    }

    console.log(`🤝 Created ${friendships.length} friendships`);

    // Create achievements
    const achievements = [];
    for (const user of users) {
      const userAchievementCount = 5 + Math.floor(Math.random() * 15); // 5-20 achievements per user
      
      for (let i = 0; i < userAchievementCount; i++) {
        const type = achievementTypes[Math.floor(Math.random() * achievementTypes.length)];
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days

        let name: string | undefined;
        let value: number;
        let unit: string;
        let duration: number | undefined;

        switch (type) {
          case 'running':
            value = Math.floor(Math.random() * 20) + 1; // 1-20 km
            unit = 'km';
            duration = Math.floor(Math.random() * 120) + 20; // 20-140 minutes
            break;
          case 'swimming':
            value = Math.floor(Math.random() * 2000) + 200; // 200-2200 meters
            unit = 'm';
            duration = Math.floor(Math.random() * 90) + 15; // 15-105 minutes
            break;
          case 'cycling':
            value = Math.floor(Math.random() * 50) + 5; // 5-55 km
            unit = 'km';
            duration = Math.floor(Math.random() * 180) + 30; // 30-210 minutes
            break;
          case 'custom':
            name = customActivities[Math.floor(Math.random() * customActivities.length)];
            value = Math.floor(Math.random() * 100) + 10; // 10-110 reps
            unit = 'reps';
            duration = Math.floor(Math.random() * 60) + 5; // 5-65 minutes
            break;
        }

        const achievement = await prisma.achievement.create({
          data: {
            userId: user.id,
            type,
            name,
            value,
            unit,
            duration,
            notes: `Great ${type} session!`,
            createdAt,
          },
        });
        achievements.push(achievement);
      }
    }

    console.log(`🏆 Created ${achievements.length} achievements`);

    // Create some friend requests
    const friendRequests = [];
    for (let i = 0; i < 5; i++) {
      const senderIndex = Math.floor(Math.random() * users.length);
      let receiverIndex = Math.floor(Math.random() * users.length);
      
      // Make sure receiver is different from sender
      while (receiverIndex === senderIndex) {
        receiverIndex = Math.floor(Math.random() * users.length);
      }

      const request = await prisma.friendRequest.create({
        data: {
          senderId: users[senderIndex].id,
          receiverId: users[receiverIndex].id,
          status: 'PENDING',
        },
      });
      friendRequests.push(request);
    }

    console.log(`📨 Created ${friendRequests.length} friend requests`);

    // Create some notifications
    const notifications = [];
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const types = ['FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED', 'NEW_ACHIEVEMENT', 'GENERAL'];
      const type = types[Math.floor(Math.random() * types.length)];

      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          title: `Notification ${i + 1}`,
          message: `This is a ${type.toLowerCase().replace('_', ' ')} notification`,
          read: Math.random() > 0.5,
        data: JSON.stringify({
          testData: true,
        }),
        },
      });
      notifications.push(notification);
    }

    console.log(`🔔 Created ${notifications.length} notifications`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Friendships: ${friendships.length}`);
    console.log(`   Achievements: ${achievements.length}`);
    console.log(`   Friend Requests: ${friendRequests.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log('\n🔑 Test credentials:');
    console.log('   Email: user1@example.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;
