# 🆘 Поддержка

## 📞 Как получить помощь

### 🔍 Поиск решения
Перед обращением за помощью, пожалуйста:
1. Проверьте [README.md](README.md)
2. Изучите [QUICK_START.md](QUICK_START.md)
3. Прочитайте [PROJECT_INFO.md](PROJECT_INFO.md)
4. Поищите в [Issues](https://github.com/mrAyubkhon/sport/issues)

### 💬 Способы связи

#### 🐛 Сообщение об ошибке
- Создайте [Bug Report](https://github.com/mrAyubkhon/sport/issues/new?template=bug_report.md)
- Укажите подробную информацию об ошибке
- Приложите скриншоты и логи

#### ✨ Предложение функции
- Создайте [Feature Request](https://github.com/mrAyubkhon/sport/issues/new?template=feature_request.md)
- Опишите желаемую функциональность
- Объясните, зачем это нужно

#### ❓ Вопрос
- Создайте [Question](https://github.com/mrAyubkhon/sport/issues/new?template=question.md)
- Опишите ваш вопрос подробно
- Укажите, что уже пробовали

## 🚀 Быстрая помощь

### ⚡ Частые проблемы

#### 🔧 Установка не работает
```bash
# Очистите кэш и переустановите
rm -rf node_modules package-lock.json
npm install
```

#### 🗄️ Проблемы с базой данных
```bash
# Пересоздайте базу данных
cd backend
npx prisma db push --force-reset
npx prisma generate
```

#### 🔐 Проблемы с аутентификацией
```bash
# Перезапустите серверы
# Очистите localStorage в браузере
# Проверьте токены в Network tab
```

#### 🌐 Проблемы с портами
```bash
# Проверьте, что порты свободны
lsof -i :5001  # Backend
lsof -i :5173  # Frontend

# Убейте процессы, если нужно
kill -9 $(lsof -t -i:5001)
kill -9 $(lsof -t -i:5173)
```

### 📋 Чек-лист для отладки

- [ ] Node.js версия 18+
- [ ] npm версия 8+
- [ ] Порты 5001 и 5173 свободны
- [ ] База данных создана и мигрирована
- [ ] Переменные окружения настроены
- [ ] Зависимости установлены
- [ ] Серверы запущены

## 🕒 Время ответа

- **Критические ошибки**: 24 часа
- **Обычные вопросы**: 2-3 дня
- **Предложения функций**: 1 неделя
- **Документация**: 3-5 дней

## 🎯 Типы поддержки

### 🆓 Бесплатная поддержка
- Основные вопросы по использованию
- Сообщения об ошибках
- Предложения улучшений
- Помощь с документацией

### 💼 Коммерческая поддержка
- Индивидуальная настройка
- Интеграция с внешними системами
- Обучение команды
- Приоритетная поддержка

## 🤝 Сообщество

### 💬 Обсуждения
- [GitHub Discussions](https://github.com/mrAyubkhon/sport/discussions)
- Общие вопросы и идеи
- Обмен опытом использования

### 📢 Обновления
- [Releases](https://github.com/mrAyubkhon/sport/releases)
- [Changelog](CHANGELOG.md)
- Подписка на репозиторий

## 📚 Полезные ссылки

### 🔗 Документация
- [React Docs](https://reactjs.org/docs)
- [Node.js Docs](https://nodejs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

### 🛠️ Инструменты
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [Docker](https://www.docker.com/)

## 📞 Контакты

- **GitHub**: [@mrAyubkhon](https://github.com/mrAyubkhon)
- **Repository**: [Sport Achievements](https://github.com/mrAyubkhon/sport)
- **Issues**: [Create Issue](https://github.com/mrAyubkhon/sport/issues/new)

## 🏆 Благодарности

Спасибо всем, кто помогает развивать проект:
- Сообщения об ошибках
- Предложения улучшений
- Участие в обсуждениях
- Вклад в код

---

**Мы всегда готовы помочь!** 🚀
