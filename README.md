# Social Network API

## Запуск проекта

### Cold Start

Для первоначального запуска проекта выполните команду:

```bash
npm run cold-start
```

Эта команда выполнит следующие действия:
1. Установит все зависимости (`npm install`).
2. Скопирует файл `example.env` в `.env`.
3. Запустит docker-контейнеры (`npm run start:containers`).
4. Запустит приложение.

## Доступные скрипты

- `npm run build`: Сборка проекта.
- `npm run build:openapi`: Генерация документации OpenAPI.
- `npm run format`: Форматирование кода.
- `npm run start`: Запуск приложения.
- `npm run start:dev`: Запуск приложения в режиме разработки с отслеживанием изменений.
- `npm run start:debug`: Запуск приложения в режиме отладки с отслеживанием изменений.
- `npm run start:prod`: Запуск приложения в продакшн режиме (из папки `dist`).
- `npm run start:containers`: Запуск docker-контейнеров.
- `npm run lint`: Проверка кода с помощью ESLint и автоматическое исправление ошибок.
- `npm run test`: Запуск тестов.
- `npm run test:watch`: Запуск тестов в режиме отслеживания изменений.
- `npm run test:cov`: Запуск тестов с генерацией отчета о покрытии.
- `npm run test:debug`: Запуск тестов в режиме отладки.
- `npm run test:e2e`: Запуск end-to-end тестов.

## API Документация

Документация API в формате OpenAPI доступна [здесь](./openapi.json). 