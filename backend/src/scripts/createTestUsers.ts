import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('🚀 Creating test users with achievements...');

    // Test users data
    const testUsers = [
      {
        name: 'Александр Иванов',
        email: 'alex.ivanov@example.com',
        password: 'password123',
        age: 28,
        weight: 75.5,
        height: 180.0,
        bio: 'Люблю бегать по утрам и плавать в бассейне. Цель - пробежать марафон в этом году!',
        achievements: [
          {
            type: 'Бег',
            name: 'Утренняя пробежка',
            value: 10,
            unit: 'км',
            duration: 45,
            notes: 'Отличная пробежка в парке'
          },
          {
            type: 'Плавание',
            name: 'Тренировка в бассейне',
            value: 2,
            unit: 'км',
            duration: 60,
            notes: 'Интенсивная тренировка'
          }
        ]
      },
      {
        name: 'Мария Петрова',
        email: 'maria.petrova@example.com',
        password: 'password123',
        age: 25,
        weight: 60.0,
        height: 165.0,
        bio: 'Фитнес-тренер и любительница велоспорта. Помогаю другим достигать своих целей.',
        achievements: [
          {
            type: 'Велоспорт',
            name: 'Велопрогулка по городу',
            value: 25,
            unit: 'км',
            duration: 90,
            notes: 'Прекрасная погода для велопрогулки'
          },
          {
            type: 'Йога',
            name: 'Утренняя практика',
            value: 1,
            unit: 'час',
            duration: 60,
            notes: 'Медитация и асаны'
          }
        ]
      },
      {
        name: 'Дмитрий Соколов',
        email: 'dmitry.sokolov@example.com',
        password: 'password123',
        age: 32,
        weight: 85.0,
        height: 185.0,
        bio: 'Триатлет и тренер по плаванию. Участвую в соревнованиях Ironman.',
        achievements: [
          {
            type: 'Плавание',
            name: 'Открытая вода',
            value: 3,
            unit: 'км',
            duration: 75,
            notes: 'Плавание в озере'
          },
          {
            type: 'Бег',
            name: 'Интервальная тренировка',
            value: 15,
            unit: 'км',
            duration: 70,
            notes: 'Высокоинтенсивная тренировка'
          },
          {
            type: 'Велоспорт',
            name: 'Горный велосипед',
            value: 50,
            unit: 'км',
            duration: 180,
            notes: 'Сложный маршрут по горам'
          }
        ]
      },
      {
        name: 'Анна Козлова',
        email: 'anna.kozlova@example.com',
        password: 'password123',
        age: 23,
        weight: 55.0,
        height: 170.0,
        bio: 'Студентка и начинающий бегун. Мечтаю пробежать полумарафон.',
        achievements: [
          {
            type: 'Бег',
            name: 'Первые 5 км',
            value: 5,
            unit: 'км',
            duration: 30,
            notes: 'Мой первый серьезный забег!'
          },
          {
            type: 'Фитнес',
            name: 'Силовая тренировка',
            value: 1,
            unit: 'час',
            duration: 60,
            notes: 'Тренировка в спортзале'
          }
        ]
      },
      {
        name: 'Сергей Волков',
        email: 'sergey.volkov@example.com',
        password: 'password123',
        age: 35,
        weight: 90.0,
        height: 190.0,
        bio: 'Любитель экстремальных видов спорта. Занимаюсь скалолазанием и бегом по пересеченной местности.',
        achievements: [
          {
            type: 'Скалолазание',
            name: 'Скальный маршрут',
            value: 1,
            unit: 'маршрут',
            duration: 120,
            notes: 'Сложный маршрут 6c'
          },
          {
            type: 'Бег',
            name: 'Трейлраннинг',
            value: 20,
            unit: 'км',
            duration: 150,
            notes: 'Бег по лесным тропам'
          }
        ]
      }
    ];

    // Create users and their achievements
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          age: userData.age,
          weight: userData.weight,
          height: userData.height,
          bio: userData.bio,
          role: 'USER'
        }
      });

      console.log(`✅ Created user: ${user.name} (${user.email})`);

      // Create achievements for this user
      for (const achievementData of userData.achievements) {
        await prisma.achievement.create({
          data: {
            type: achievementData.type,
            name: achievementData.name,
            value: achievementData.value,
            unit: achievementData.unit,
            duration: achievementData.duration,
            notes: achievementData.notes,
            userId: user.id
          }
        });
      }

      console.log(`🏆 Created ${userData.achievements.length} achievements for ${user.name}`);
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│ Email                           │ Password    │ Name            │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log('│ alex.ivanov@example.com         │ password123 │ Александр Иванов │');
    console.log('│ maria.petrova@example.com       │ password123 │ Мария Петрова   │');
    console.log('│ dmitry.sokolov@example.com      │ password123 │ Дмитрий Соколов │');
    console.log('│ anna.kozlova@example.com        │ password123 │ Анна Козлова    │');
    console.log('│ sergey.volkov@example.com       │ password123 │ Сергей Волков   │');
    console.log('└─────────────────────────────────────────────────────────────────┘');

  } catch (error: any) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
