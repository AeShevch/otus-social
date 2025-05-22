import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';

import { EConfig } from '@otus-social/config/types';
import { DatabaseService } from '@otus-social/database/database.service';

jest.mock('pg', () => ({
  Pool: jest.fn(),
}));

jest.mock('@otus-social/database/sql', () => ({
  SQL: {
    tables: {
      users: 'CREATE TABLE users (id SERIAL PRIMARY KEY);',
      profiles: 'CREATE TABLE profiles (id SERIAL PRIMARY KEY);',
    },
    queries: {},
  },
}));

const MOCKED_SQL_TABLES_FOR_TEST_ASSERTIONS = {
  users: 'CREATE TABLE users (id SERIAL PRIMARY KEY);',
  profiles: 'CREATE TABLE profiles (id SERIAL PRIMARY KEY);',
};

const mockPoolQuery = jest.fn();
const mockPoolConnect = jest.fn();
const mockPoolEnd = jest.fn();
const mockClientRelease = jest.fn();

describe('DatabaseService', () => {
  let service: DatabaseService;
  let loggerSpyLog: jest.SpyInstance;
  let loggerSpyError: jest.SpyInstance;

  const MockedPoolConstructor = Pool as unknown as jest.Mock;

  beforeEach(async () => {
    mockPoolQuery.mockReset();
    mockPoolConnect.mockReset();
    mockPoolEnd.mockReset();
    mockClientRelease.mockReset();

    mockPoolConnect.mockResolvedValue({ release: mockClientRelease });

    MockedPoolConstructor.mockClear();
    MockedPoolConstructor.mockImplementation(() => ({
      connect: mockPoolConnect,
      query: mockPoolQuery,
      end: mockPoolEnd,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: EConfig) => {
              switch (key) {
                case EConfig.DATABASE_HOST:
                  return 'localhost';
                case EConfig.DATABASE_PORT:
                  return 5432;
                case EConfig.DATABASE_USER:
                  return 'testuser';
                case EConfig.DATABASE_PASSWORD:
                  return 'testpass';
                case EConfig.DATABASE_NAME:
                  return 'testdb';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);

    loggerSpyLog = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});
    loggerSpyError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Constructor', () => {
    it('should create a new Pool with config values', () => {
      expect(MockedPoolConstructor).toHaveBeenCalledTimes(1);
      expect(MockedPoolConstructor).toHaveBeenCalledWith({
        host: 'localhost',
        port: 5432,
        user: 'testuser',
        password: 'testpass',
        database: 'testdb',
      });
    });
  });

  describe('onModuleInit', () => {
    it('should connect to the database, initialize tables, and log success', async () => {
      mockPoolQuery.mockResolvedValue(undefined);
      await service.onModuleInit();
      expect(mockPoolConnect).toHaveBeenCalledTimes(1);
      expect(mockClientRelease).toHaveBeenCalledTimes(1);
      expect(loggerSpyLog).toHaveBeenCalledWith(
        'Successfully connected to PostgreSQL: localhost:5432/testdb',
      );
      expect(mockPoolQuery).toHaveBeenCalledTimes(
        Object.keys(MOCKED_SQL_TABLES_FOR_TEST_ASSERTIONS).length,
      );
      for (const [tableName, query] of Object.entries(
        MOCKED_SQL_TABLES_FOR_TEST_ASSERTIONS,
      )) {
        expect(mockPoolQuery).toHaveBeenCalledWith(query);
        expect(loggerSpyLog).toHaveBeenCalledWith(
          `Table "${tableName}" initialized successfully`,
        );
      }
      expect(loggerSpyLog).toHaveBeenCalledWith(
        'Database initialization completed successfully',
      );
    });

    it('should log and throw error if database connection fails', async () => {
      const connectionError = new Error('Connection failed');
      mockPoolConnect.mockRejectedValueOnce(connectionError);
      await expect(service.onModuleInit()).rejects.toThrow(connectionError);
      expect(loggerSpyError).toHaveBeenCalledWith(
        'Database connection error:',
        connectionError.message,
      );
    });

    it('should log and throw error if table initialization fails', async () => {
      const tableInitError = new Error('Table init failed');
      mockPoolQuery.mockRejectedValueOnce(tableInitError);
      await expect(service.onModuleInit()).rejects.toThrow(tableInitError);
      expect(mockPoolConnect).toHaveBeenCalledTimes(1);
      expect(mockClientRelease).toHaveBeenCalledTimes(1);
      expect(loggerSpyError).toHaveBeenCalledWith(
        'Table initialization error:',
        tableInitError.message,
      );
      expect(loggerSpyError).toHaveBeenCalledWith(
        'Database connection error:',
        tableInitError.message,
      );
      expect(loggerSpyLog).not.toHaveBeenCalledWith(
        'Database initialization completed successfully',
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should end the pool connection and log success', async () => {
      mockPoolEnd.mockResolvedValue(undefined);
      await service.onModuleDestroy();
      expect(mockPoolEnd).toHaveBeenCalledTimes(1);
      expect(loggerSpyLog).toHaveBeenCalledWith(
        'Database connection closed successfully',
      );
    });

    it('should log error if closing connection fails', async () => {
      const closeError = new Error('Failed to close');
      mockPoolEnd.mockRejectedValueOnce(closeError);
      await service.onModuleDestroy();
      expect(mockPoolEnd).toHaveBeenCalledTimes(1);
      expect(loggerSpyError).toHaveBeenCalledWith(
        'Error closing database connection:',
        closeError.message,
      );
    });
  });

  describe('getPool', () => {
    it('should return the pool instance created by the mocked constructor', () => {
      const poolInstance = service.getPool();
      expect(MockedPoolConstructor.mock.results[0].value).toBe(poolInstance);
      expect(poolInstance.connect).toBe(mockPoolConnect);
      expect(poolInstance.query).toBe(mockPoolQuery);
      expect(poolInstance.end).toBe(mockPoolEnd);
    });
  });
});
