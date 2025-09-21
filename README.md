# 🏆 Sport Achievements & Friends

Полнофункциональное веб-приложение для отслеживания спортивных достижений с социальными функциями.

## ✨ Особенности

- 🏃‍♂️ **Отслеживание достижений** - записывайте свои спортивные результаты
- 👥 **Социальные функции** - добавляйте друзей и следите за их прогрессом
- 📊 **Статистика и аналитика** - просматривайте детальную статистику
- 🔔 **Уведомления** - получайте уведомления о новых достижениях друзей
- 👑 **Админская панель** - управление пользователями для администраторов
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🎨 **Современный UI** - красивый и интуитивный интерфейс

## 🚀 Технологии

### Frontend
- **React 18** - современная библиотека для UI
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый инструмент сборки
- **TailwindCSS** - utility-first CSS фреймворк
- **React Router** - маршрутизация
- **Framer Motion** - анимации

### Backend
- **Node.js** - серверная среда выполнения
- **Express.js** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **Prisma** - современная ORM для работы с БД
- **SQLite** - легковесная база данных
- **JWT** - аутентификация и авторизация
- **Socket.io** - real-time коммуникация

### Дополнительные инструменты
- **ESLint + Prettier** - качество кода
- **Jest** - тестирование
- **Docker** - контейнеризация

## 📦 Установка и запуск

> 💡 **Быстрый старт**: См. [QUICK_START.md](QUICK_START.md) для запуска за 5 минут
> 📊 **Подробности**: См. [PROJECT_INFO.md](PROJECT_INFO.md) для технической информации

### Предварительные требования
- Node.js (версия 18 или выше)
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone https://github.com/mrAyubkhon/sport.git
cd sport
```

### 2. Установка зависимостей
```bash
# Backend
cd backend
npm install

# Frontend (в новом терминале)
cd frontend
npm install
```

### 3. Настройка базы данных
```bash
# В папке backend
npx prisma db push
npx prisma generate
```

### 4. Создание админского аккаунта
```bash
# В папке backend
npx tsx src/scripts/createAdmin.ts
```

### 5. Создание тестовых пользователей
```bash
# В папке backend
npx tsx src/scripts/createTestUsers.ts
```

### 6. Запуск приложения
```bash
# Backend (терминал 1)
cd backend
npm run dev

# Frontend (терминал 2)
cd frontend
npm run dev
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 👤 Тестовые аккаунты

### Обычные пользователи
| Email | Password | Name |
|-------|----------|------|
| alex.ivanov@example.com | password123 | Александр Иванов |
| maria.petrova@example.com | password123 | Мария Петрова |
| dmitry.sokolov@example.com | password123 | Дмитрий Соколов |
| anna.kozlova@example.com | password123 | Анна Козлова |
| sergey.volkov@example.com | password123 | Сергей Волков |

### Админский аккаунт
| Email | Password | Role |
|-------|----------|------|
| admin@sportachievements.com | admin123 | ADMIN |

## 📁 Структура проекта

```
sport-achievements/
├── backend/                 # Backend приложение
│   ├── src/
│   │   ├── controllers/     # Контроллеры API
│   │   ├── middleware/      # Middleware функции
│   │   ├── routes/          # Маршруты API
│   │   ├── services/        # Бизнес-логика
│   │   ├── utils/           # Утилиты
│   │   ├── scripts/         # Скрипты (создание пользователей)
│   │   └── types/           # TypeScript типы
│   ├── prisma/              # Схема базы данных
│   └── package.json
├── frontend/                # Frontend приложение
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── services/        # API клиенты
│   │   ├── store/           # Zustand store
│   │   ├── utils/           # Утилиты
│   │   └── types/           # TypeScript типы
│   └── package.json
├── docker-compose.yml       # Docker конфигурация
└── README.md
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/refresh` - Обновление токена

### Пользователи
- `GET /api/users/profile` - Получение профиля
- `PUT /api/users/profile` - Обновление профиля
- `GET /api/users/leaderboard` - Таблица лидеров

### Достижения
- `GET /api/achievements` - Получение достижений
- `POST /api/achievements` - Создание достижения
- `PUT /api/achievements/:id` - Обновление достижения
- `DELETE /api/achievements/:id` - Удаление достижения

### Друзья
- `GET /api/friends` - Список друзей
- `POST /api/friends/request` - Отправка запроса в друзья
- `PUT /api/friends/request/:id` - Ответ на запрос
- `DELETE /api/friends/:id` - Удаление из друзей

### Админка
- `GET /api/admin/users` - Все пользователи
- `GET /api/admin/achievements` - Все достижения
- `GET /api/admin/friend-requests` - Все запросы в друзья

## 🗄️ База данных

Приложение использует SQLite базу данных с Prisma ORM. Схема включает:

- **Users** - пользователи с профильной информацией
- **Achievements** - спортивные достижения
- **Friendships** - связи между друзьями
- **FriendRequests** - запросы в друзья
- **Notifications** - уведомления
- **RefreshTokens** - токены обновления

## 🚀 Развертывание

### Docker
```bash
docker-compose up -d
```

### Продакшн
1. Настройте переменные окружения
2. Используйте PostgreSQL вместо SQLite
3. Настройте reverse proxy (nginx)
4. Используйте PM2 для управления процессами

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Зафиксируйте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 👨‍💻 Автор

**Muhammad Ayubkhon**
- GitHub: [@mrAyubkhon](https://github.com/mrAyubkhon)
- Repository: [Sport Achievements](https://github.com/mrAyubkhon/sport)

## 🙏 Благодарности

- React команде за отличную библиотеку
- Prisma команде за современную ORM
- TailwindCSS за utility-first подход
- Всем open-source разработчикам за их вклад

## 📚 Дополнительная документация

- [🚀 Быстрый старт](QUICK_START.md) - запуск за 5 минут
- [📊 Информация о проекте](PROJECT_INFO.md) - технические детали
- [🤝 Руководство по вкладу](CONTRIBUTING.md) - как внести вклад
- [👥 Контрибьюторы](CONTRIBUTORS.md) - список участников
- [📝 Changelog](CHANGELOG.md) - история изменений

## 🏆 Достижения проекта

- ✅ **Полнофункциональное приложение** - готово к использованию
- ✅ **Современный стек технологий** - React, TypeScript, Node.js
- ✅ **Безопасность** - JWT, bcrypt, валидация данных
- ✅ **Документация** - подробные инструкции и примеры
- ✅ **Тестовые данные** - готовые аккаунты для демонстрации
- ✅ **Open Source** - MIT лицензия, доступно для всех

---

⭐ **Если проект вам понравился, поставьте звезду!**

🌟 **Следите за обновлениями** - подписывайтесь на репозиторий

🤝 **Присоединяйтесь к развитию** - форкните и внесите свой вклад