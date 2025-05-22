import { Test, type TestingModule } from '@nestjs/testing';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { DatabaseService } from '@otus-social/database/database.service';
import { SQL } from '@otus-social/database/sql';
import type { IProfile } from '@otus-social/profiles/interfaces/profile.interface';
import { ProfileModel } from '@otus-social/profiles/models/profile.model';
import { ProfileRepository } from '@otus-social/profiles/repositories/profile.repository';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;
  let databaseService: DatabaseService;

  const mockDbProfile: IProfile = {
    id: 1,
    user_id: 1,
    first_name: 'Test',
    last_name: 'User',
    birth_date: new Date('1990-01-01'),
    city: 'Test City',
    gender: 'male',
    interests: ['coding'],
  };

  const mockProfileModel = ProfileModel.fromDatabase(mockDbProfile);

  const mockProfileInputData: Omit<
    IRegisterData,
    'username' | 'email' | 'password' | 'confirmPassword'
  > = {
    firstName: 'Test',
    lastName: 'User',
    birthDate: '1990-01-01',
    city: 'Test City',
    gender: 'male',
    interests: ['coding'],
  };

  const mockQuery = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileRepository,
        {
          provide: DatabaseService,
          useValue: {
            getPool: jest.fn(() => ({
              query: mockQuery,
            })),
          },
        },
      ],
    }).compile();

    repository = module.get<ProfileRepository>(ProfileRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    mockQuery.mockClear();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call databaseService.query with correct SQL and params, and return a ProfileModel', async () => {
      mockQuery.mockResolvedValue({ rows: [mockDbProfile] });

      const result = await repository.create(1, mockProfileInputData);

      expect(databaseService.getPool().query).toHaveBeenCalledWith(
        SQL.queries.createProfile,
        [
          1,
          mockProfileInputData.firstName,
          mockProfileInputData.lastName,
          mockProfileInputData.birthDate,
          mockProfileInputData.gender,
          mockProfileInputData.interests,
          mockProfileInputData.city,
        ],
      );
      expect(result).toEqual(mockProfileModel);
    });
  });

  describe('findByUserId', () => {
    it('should call databaseService.query with correct SQL and userId, and return a ProfileModel if found', async () => {
      mockQuery.mockResolvedValue({ rows: [mockDbProfile] });

      const result = await repository.findByUserId(1);

      expect(databaseService.getPool().query).toHaveBeenCalledWith(
        SQL.queries.findProfileByUserId,
        [1],
      );
      expect(result).toEqual(mockProfileModel);
    });

    it('should return null if profile not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await repository.findByUserId(1);

      expect(databaseService.getPool().query).toHaveBeenCalledWith(
        SQL.queries.findProfileByUserId,
        [1],
      );
      expect(result).toBeNull();
    });
  });
});
