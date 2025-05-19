import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { EConfig } from '@otus-social/config/types';
import { SQL } from '@otus-social/database/sql';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get(EConfig.DATABASE_HOST),
      port: this.configService.get(EConfig.DATABASE_PORT),
      user: this.configService.get(EConfig.DATABASE_USER),
      password: this.configService.get(EConfig.DATABASE_PASSWORD),
      database: this.configService.get(EConfig.DATABASE_NAME),
    });
  }

  public async onModuleInit(): Promise<void> {
    try {
      const client = await this.pool.connect();

      this.logger.log(
        `Successfully connected to PostgreSQL: ${this.configService.get(
          EConfig.DATABASE_HOST,
        )}:${this.configService.get(EConfig.DATABASE_PORT)}/${this.configService.get(
          EConfig.DATABASE_NAME,
        )}`,
      );

      client.release();

      await this.initializeTables();

      this.logger.log('Database initialization completed successfully');
    } catch (error) {
      this.logger.error('Database connection error:', error.message);
      throw error;
    }
  }

  private async initializeTables(): Promise<void> {
    try {
      for (const [tableName, query] of Object.entries(SQL.tables)) {
        await this.pool.query(query);
        this.logger.log(`Table "${tableName}" initialized successfully`);
      }
    } catch (error) {
      this.logger.error('Table initialization error:', error.message);
      throw error;
    }
  }

  public async onModuleDestroy(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.log('Database connection closed successfully');
    } catch (error) {
      this.logger.error('Error closing database connection:', error.message);
    }
  }

  public getPool(): Pool {
    return this.pool;
  }
}
