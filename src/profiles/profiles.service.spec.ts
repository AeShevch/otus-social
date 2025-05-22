import { Test, type TestingModule } from '@nestjs/testing';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import type { ProfileModel } from '@otus-social/profiles/models/profile.model';
import { ProfilesService } from '@otus-social/profiles/profiles.service';
import { ProfileRepository } from '@otus-social/profiles/repositories/profile.repository';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let repository: ProfileRepository;

  const mockProfile: ProfileModel = {
    id: 1,
    user_id: 1,
    first_name: 'Test',
    last_name: 'User',
    birth_date: new Date('1990-01-01'),
    city: 'Test City',
    gender: 'male',
    interests: ['coding'],
  };

  const mockProfileInput: Omit<
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfileRepository,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    repository = module.get<ProfileRepository>(ProfileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should call repository.create with correct params and return a profile', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockProfile);

      const result = await service.createProfile(1, mockProfileInput);
      expect(repository.create).toHaveBeenCalledWith(1, mockProfileInput);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getProfileByUserId', () => {
    it('should call repository.findByUserId with correct userId and return a profile', async () => {
      jest.spyOn(repository, 'findByUserId').mockResolvedValue(mockProfile);

      const result = await service.getProfileByUserId(1);
      expect(repository.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProfile);
    });

    it('should call repository.findByUserId and return null if profile not found', async () => {
      jest.spyOn(repository, 'findByUserId').mockResolvedValue(null);

      const result = await service.getProfileByUserId(1);
      expect(repository.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });
});
