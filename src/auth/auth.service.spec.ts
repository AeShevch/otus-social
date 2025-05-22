import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from '@otus-social/auth/auth.service';
import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { ProfilesService } from '@otus-social/profiles/profiles.service';
import type { IUserWithoutPassword } from '@otus-social/users/interfaces/user.interface';
import { type UserModel } from '@otus-social/users/models/user.model';
import { UsersService } from '@otus-social/users/users.service';

import type { TestingModule } from '@nestjs/testing';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let profilesService: ProfilesService;
  let jwtService: JwtService;
  let module: TestingModule;

  const mockUserModelToResponse = (
    user: Partial<UserModel> & { id: number },
  ): IUserWithoutPassword => ({
    id: user.id,
    username: user.username || '',
    email: user.email || '',
    created_at: user.created_at || new Date(),
    updated_at: user.updated_at || new Date(),
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ProfilesService,
          useValue: {
            createProfile: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_EXPIRES_IN') return '1h';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    profilesService = module.get<ProfilesService>(ProfilesService);
    jwtService = module.get<JwtService>(JwtService);

    (bcrypt.compare as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const username = 'testuser';
    const password = 'password';

    const baseMockUser = {
      id: 1,
      username,
      email: 'test@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockUserWithPassword = {
      ...baseMockUser,
      password: 'hashedPassword',
      toResponse: jest
        .fn()
        .mockImplementation(() =>
          mockUserModelToResponse(baseMockUser as UserModel),
        ),
    } as unknown as UserModel;

    const mockUserWithoutPassword = {
      ...baseMockUser,
      password: null,
      toResponse: jest
        .fn()
        .mockImplementation(() =>
          mockUserModelToResponse(baseMockUser as UserModel),
        ),
    } as unknown as UserModel;

    it('should return user if validation is successful', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(
        mockUserWithPassword,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserWithPassword.toResponse = jest
        .fn()
        .mockReturnValue(mockUserModelToResponse(mockUserWithPassword as any));

      const result = await service.validateUser(username, password);

      expect(result?.id).toEqual(baseMockUser.id);
      expect(result?.username).toEqual(baseMockUser.username);
      expect(result?.email).toEqual(baseMockUser.email);
      expect(result?.created_at).toBeInstanceOf(Date);
      expect(result?.updated_at).toBeInstanceOf(Date);

      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserWithPassword.password,
      );
      expect(mockUserWithPassword.toResponse).toHaveBeenCalled();
    });

    it('should return null if user is not found', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null if user has no password', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(
        mockUserWithoutPassword,
      );
      mockUserWithoutPassword.toResponse = jest
        .fn()
        .mockReturnValue(
          mockUserModelToResponse(mockUserWithoutPassword as any),
        );

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockUserWithoutPassword.toResponse).not.toHaveBeenCalled();
    });

    it('should return null if password comparison fails', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(
        mockUserWithPassword,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockUserWithPassword.toResponse = jest
        .fn()
        .mockReturnValue(mockUserModelToResponse(mockUserWithPassword as any));

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserWithPassword.password,
      );
      expect(mockUserWithPassword.toResponse).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const username = 'testuser';
    const password = 'password';
    const mockUserResponse = {
      id: 1,
      username,
      email: 'test@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    } as IUserWithoutPassword;
    const jwtToken = 'test_jwt_token';
    let generateJwtSpy: jest.SpyInstance;

    beforeEach(() => {
      generateJwtSpy = jest.spyOn(service as any, 'generateJwt');
    });

    afterEach(() => {
      generateJwtSpy.mockRestore();
    });

    it('should return JWT on successful login', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUserResponse);
      generateJwtSpy.mockReturnValue({
        user_id: mockUserResponse.id,
        access_token: jwtToken,
      });
      (jwtService.sign as jest.Mock).mockReturnValue(jwtToken);

      const result = await service.login(username, password);

      expect(service.validateUser).toHaveBeenCalledWith(username, password);
      expect(generateJwtSpy).toHaveBeenCalledWith(mockUserResponse);
      expect(result).toEqual({
        user_id: mockUserResponse.id,
        access_token: jwtToken,
      });
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(username, password)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(service.validateUser).toHaveBeenCalledWith(username, password);
      expect(generateJwtSpy).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerData: IRegisterData = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      birthDate: '1990-01-01',
      city: 'New City',
      gender: 'male' as const,
    };
    const hashedPassword = 'hashedPassword';
    const mockCreatedUserModel = {
      id: 2,
      username: registerData.username,
      email: registerData.email,
      created_at: new Date(),
      updated_at: new Date(),
      toResponse: jest.fn(),
    } as unknown as UserModel;

    beforeEach(() => {
      (usersService.findByUsername as jest.Mock).mockReset();
      (usersService.findByEmail as jest.Mock).mockReset();
      (usersService.create as jest.Mock).mockReset();
      (profilesService.createProfile as jest.Mock).mockReset();
      (bcrypt.hash as jest.Mock).mockReset();

      mockCreatedUserModel.toResponse = jest.fn().mockImplementation(() => {
        const now = new Date();
        return {
          id: mockCreatedUserModel.id,
          username: mockCreatedUserModel.username,
          email: mockCreatedUserModel.email,
          created_at: now,
          updated_at: now,
        };
      });
    });

    it('should register a new user and return user data', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(null);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (usersService.create as jest.Mock).mockResolvedValue(
        mockCreatedUserModel,
      );
      (profilesService.createProfile as jest.Mock).mockResolvedValue(undefined);

      const toResponseResult = mockUserModelToResponse(
        mockCreatedUserModel as any,
      );
      mockCreatedUserModel.toResponse = jest
        .fn()
        .mockReturnValue(toResponseResult);

      const result = await service.register(registerData);

      expect(result.id).toEqual(toResponseResult.id);
      expect(result.username).toEqual(toResponseResult.username);
      expect(result.email).toEqual(toResponseResult.email);
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);

      expect(usersService.findByUsername).toHaveBeenCalledWith(
        registerData.username,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(usersService.create).toHaveBeenCalledWith(
        { username: registerData.username, email: registerData.email },
        hashedPassword,
      );
      expect(profilesService.createProfile).toHaveBeenCalledWith(
        mockCreatedUserModel.id,
        {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          birthDate: registerData.birthDate,
          city: registerData.city,
          gender: registerData.gender,
        },
      );
      expect(mockCreatedUserModel.toResponse).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(
        mockCreatedUserModel,
      );
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.register(registerData)).rejects.toThrow(
        'User with this username already exists',
      );
      expect(usersService.findByUsername).toHaveBeenCalledWith(
        registerData.username,
      );
      expect(usersService.findByEmail).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
      expect(profilesService.createProfile).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(null);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(
        mockCreatedUserModel,
      );

      await expect(service.register(registerData)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(usersService.findByUsername).toHaveBeenCalledWith(
        registerData.username,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
      expect(profilesService.createProfile).not.toHaveBeenCalled();
    });
  });
});
