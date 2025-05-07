import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { EConfig } from "@otus-social/types/config-service";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get(EConfig.DATABASE_HOST),
      port: this.configService.get(EConfig.DATABASE_PORT),
      user: this.configService.get(EConfig.DATABASE_USER),
      password: this.configService.get(EConfig.DATABASE_PASSWORD),
      database: this.configService.get(EConfig.DATABASE_NAME),
    });
  }

  public async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async onModuleDestroy() {
    await this.pool.end();
  }

  public getPool(): Pool {
    return this.pool;
  }
} 