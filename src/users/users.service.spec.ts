import { Test, type TestingModule } from '@nestjs/testing';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { UserModel } from '@otus-social/users/models/user.model';
import { UserRepository } from '@otus-social/users/repositories/user.repository';
import { UsersService } from '@otus-social/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUser: UserModel = new UserModel({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  });

  const mockUserData: Pick<IRegisterData, 'username' | 'email'> = {
    username: 'newuser',
    email: 'new@example.com',
  };
  const mockHashedPassword = 'newhashedpassword';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should call repository.findById with correct id and return a user', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);
      const result = await service.findById(1);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by id', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      const result = await service.findById(1);
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should call repository.findByUsername with correct username and return a user', async () => {
      jest.spyOn(repository, 'findByUsername').mockResolvedValue(mockUser);
      const result = await service.findByUsername('testuser');
      expect(repository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by username', async () => {
      jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);
      const result = await service.findByUsername('testuser');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should call repository.findByEmail with correct email and return a user', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by email', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      const result = await service.findByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should call repository.create with correct params and return a new user', async () => {
      const newMockUser = new UserModel({
        ...mockUserData,
        id: 2,
        password: mockHashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });
      jest.spyOn(repository, 'create').mockResolvedValue(newMockUser);

      const result = await service.create(mockUserData, mockHashedPassword);
      expect(repository.create).toHaveBeenCalledWith(
        mockUserData,
        mockHashedPassword,
      );
      expect(result).toEqual(newMockUser);
    });
  });
});
