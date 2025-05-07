import { ConfigService as NestConfigService } from '@nestjs/config';

export enum EConfig {
  // Database
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
  DATABASE_USER = 'DATABASE_USER',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',
  DATABASE_NAME = 'DATABASE_NAME',
  
  // JWT
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
}

type ConfigKeyTypeMap = {
  [EConfig.DATABASE_HOST]: string;
  [EConfig.DATABASE_PORT]: number;
  [EConfig.DATABASE_USER]: string;
  [EConfig.DATABASE_PASSWORD]: string;
  [EConfig.DATABASE_NAME]: string;
  [EConfig.JWT_SECRET]: string;
  [EConfig.JWT_EXPIRES_IN]: string;
};

declare module '@nestjs/config' {
  interface ConfigService {
    get<K extends EConfig>(key: K): ConfigKeyTypeMap[K];
    get<K extends EConfig, D>(key: K, defaultValue: D): ConfigKeyTypeMap[K] | D;
  }
} 