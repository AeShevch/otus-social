## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## База данных PostgreSQL

Для запуска проекта с базой данных PostgreSQL в Docker:

1. Создайте файл `.env` в корне проекта со следующим содержимым:

```
# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=otus_social

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d

# App
PORT=3000
```

2. Запустите PostgreSQL в Docker:

```bash
docker-compose up -d
```

3. База данных будет доступна по адресу `localhost:5432`.

## Запуск приложения

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
