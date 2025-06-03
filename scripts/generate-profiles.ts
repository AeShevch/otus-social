import { faker } from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { type Pool } from 'pg';

import { AppModule } from '@otus-social/app.module';
import { DatabaseService } from '@otus-social/database/database.service';

interface IGeneratedUser {
  username: string;
  email: string;
  password: string;
}

interface IGeneratedProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  gender: string;
  interests: string[];
  city: string;
}

const BATCH_SIZE = 1000;
const TOTAL_PROFILES = 1_000_000;

async function generateProfiles() {
  console.log('Начинаю генерацию 1,000,000 профилей...');
  const startTime = Date.now();

  try {
    const app = await NestFactory.create(AppModule);
    const databaseService = app.get(DatabaseService);
    const pool = databaseService.getPool();

    const totalBatches = Math.ceil(TOTAL_PROFILES / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
      const batchStartTime = Date.now();
      const currentBatchSize = Math.min(
        BATCH_SIZE,
        TOTAL_PROFILES - batch * BATCH_SIZE,
      );

      console.log(
        `Обрабатываю батч ${batch + 1}/${totalBatches} (${currentBatchSize} записей)...`,
      );

      const users = generateUsers(currentBatchSize);

      const userIds = await insertUsers(pool, users);

      const profiles = generateProfilesForUsers(userIds);

      await insertProfiles(pool, profiles);

      const batchTime = Date.now() - batchStartTime;
      const processed = (batch + 1) * BATCH_SIZE;
      const progress = Math.min((processed / TOTAL_PROFILES) * 100, 100);

      console.log(
        `✅ Батч ${batch + 1} завершен за ${batchTime}ms (${progress.toFixed(1)}%)`,
      );
    }

    await app.close();

    const totalTime = Date.now() - startTime;
    console.log(
      `🎉 Генерация завершена! Создано ${TOTAL_PROFILES} профилей за ${(totalTime / 1000).toFixed(2)}s`,
    );
  } catch (error) {
    console.error('❌ Ошибка при генерации профилей:', error);
    process.exit(1);
  }
}

function generateUsers(count: number): IGeneratedUser[] {
  const users: IGeneratedUser[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < count; i++) {
    const batchIndex = Math.floor(Math.random() * 1000000);

    users.push({
      username:
        `${faker.internet.username()}_${timestamp}_${batchIndex}_${i}`.toLowerCase(),
      email:
        `${faker.internet.username()}_${timestamp}_${batchIndex}_${i}@${faker.internet.domainName()}`.toLowerCase(),
      password: '$2b$10$hashedPasswordExample',
    });
  }

  return users;
}

function generateProfilesForUsers(userIds: number[]): IGeneratedProfile[] {
  const profiles: IGeneratedProfile[] = [];
  const interests = [
    'Спорт',
    'Музыка',
    'Кино',
    'Путешествия',
    'Чтение',
    'Готовка',
    'Фотография',
    'Танцы',
    'Рисование',
    'Программирование',
    'Игры',
    'Йога',
    'Бег',
    'Велосипед',
    'Плавание',
    'Футбол',
    'Теннис',
  ];

  const cities = [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
    'Уфа',
    'Красноярск',
    'Воронеж',
    'Пермь',
    'Волгоград',
  ];

  for (const userId of userIds) {
    const gender = faker.helpers.arrayElement([
      'Мужской',
      'Женский',
      'Не указан',
    ]);
    const userInterests = faker.helpers.arrayElements(interests, {
      min: 1,
      max: 5,
    });

    profiles.push({
      user_id: userId,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      birth_date: faker.date.between({ from: '1960-01-01', to: '2005-12-31' }),
      gender,
      interests: userInterests,
      city: faker.helpers.arrayElement(cities),
    });
  }

  return profiles;
}

async function insertUsers(
  pool: Pool,
  users: IGeneratedUser[],
): Promise<number[]> {
  const values = users
    .map(
      (user, index) =>
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`,
    )
    .join(', ');

  const params = users.flatMap((user) => [
    user.username,
    user.email,
    user.password,
  ]);

  const query = `
    INSERT INTO users (username, email, password) 
    VALUES ${values}
    RETURNING id
  `;

  const result = await pool.query(query, params);
  return result.rows.map((row) => row.id as number);
}

async function insertProfiles(
  pool: Pool,
  profiles: IGeneratedProfile[],
): Promise<void> {
  const values = profiles
    .map(
      (_, index) =>
        `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`,
    )
    .join(', ');

  const params = profiles.flatMap((profile) => [
    profile.user_id,
    profile.first_name,
    profile.last_name,
    profile.birth_date,
    profile.gender,
    profile.interests,
    profile.city,
  ]);

  const query = `
    INSERT INTO profiles (user_id, first_name, last_name, birth_date, gender, interests, city) 
    VALUES ${values}
  `;

  await pool.query(query, params);
}

void generateProfiles();
