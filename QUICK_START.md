# 🚀 Быстрый старт

## ⚡ Запуск за 5 минут

### 1. Клонирование и установка
```bash
git clone https://github.com/mrAyubkhon/sport.git
cd sport
```

### 2. Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npx tsx src/scripts/createAdmin.ts
npx tsx src/scripts/createTestUsers.ts
npm run dev
```

### 3. Frontend (новый терминал)
```bash
cd frontend
npm install
npm run dev
```

### 4. Готово! 🎉
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 👤 Тестовые аккаунты

| Email | Password | Role |
|-------|----------|------|
| admin@sportachievements.com | admin123 | ADMIN |
| alex.ivanov@example.com | password123 | USER |
| maria.petrova@example.com | password123 | USER |

## 🔧 Основные команды

```bash
# Создание админа
npx tsx src/scripts/createAdmin.ts

# Создание тестовых пользователей
npx tsx src/scripts/createTestUsers.ts

# Обновление базы данных
npx prisma db push

# Генерация Prisma клиента
npx prisma generate
```

## 📱 Что можно делать

- ✅ Регистрация и вход
- ✅ Создание и просмотр достижений
- ✅ Добавление друзей
- ✅ Просмотр статистики
- ✅ Админская панель (для админов)
- ✅ Редактирование профиля

## 🆘 Помощь

Если что-то не работает:
1. Проверьте, что порты 5001 и 5173 свободны
2. Убедитесь, что Node.js версии 18+
3. Перезапустите серверы
4. Проверьте логи в терминале
