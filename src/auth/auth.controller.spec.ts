import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { AuthController } from '@otus-social/auth/auth.controller';
import { AuthService } from '@otus-social/auth/auth.service';
import {
  type LoginRequestDto,
  LoginResponseDto,
  type RegisterRequestDto,
  RegisterResponseDto,
} from '@otus-social/auth/dto';
import { ProfilesService } from '@otus-social/profiles/profiles.service';
import { UsersService } from '@otus-social/users/users.service';

import type { TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { createUser: jest.fn(), findOneByUsername: jest.fn() },
        },
        { provide: ProfilesService, useValue: { createProfile: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return user data', async () => {
      const registerDto: RegisterRequestDto = {
        username: 'testuser',
        password: 'password',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const expectedResult = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jest
        .spyOn(authService, 'register')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(
        plainToInstance(RegisterResponseDto, expectedResult),
      );
    });

    it('should throw an error if registration fails', async () => {
      const registerDto: RegisterRequestDto = {
        username: 'testuser',
        password: 'password',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const errorMessage = 'Registration failed';
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.register(registerDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const loginDto: LoginRequestDto = {
        username: 'testuser',
        password: 'password',
      };
      const expectedResult = { accessToken: 'testtoken' };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult as any);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(result).toEqual(plainToInstance(LoginResponseDto, expectedResult));
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginRequestDto = {
        username: 'testuser',
        password: 'password',
      };
      const errorMessage = 'Login failed';
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.login(loginDto)).rejects.toThrowError(
        errorMessage,
      );
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });
  });
});
