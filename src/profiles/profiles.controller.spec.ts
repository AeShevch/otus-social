import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, type TestingModule } from '@nestjs/testing';

import type { ProfileResponseDto } from '@otus-social/profiles/dto';
import { ProfilesController } from '@otus-social/profiles/profiles.controller';
import { ProfilesService } from '@otus-social/profiles/profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  const mockProfile: ProfileResponseDto = {
    id: 1,
    user_id: 1,
    first_name: 'Test',
    last_name: 'User',
    birth_date: new Date('1990-01-01'),
    city: 'Test City',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: {
            getProfileByUserId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true }) // Мокаем AuthGuard
      .compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfileByUserId', () => {
    it('should return profile if found', async () => {
      jest.spyOn(service, 'getProfileByUserId').mockResolvedValue(mockProfile);

      const result = await controller.getProfileByUserId(1);
      expect(result).toEqual(mockProfile);
      expect(service.getProfileByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if profile not found', async () => {
      jest.spyOn(service, 'getProfileByUserId').mockResolvedValue(null);

      await expect(controller.getProfileByUserId(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getProfileByUserId).toHaveBeenCalledWith(1);
    });
  });
});
