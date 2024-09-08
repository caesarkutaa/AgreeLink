import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { ConflictException, Logger } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'mocked_access_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_jwt_secret'),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a user and return a success message when registration is successful', async () => {
    const mockUser = {
      id: 'new_user_id',
      email: 'newuser@example.com',
      username: 'newuser',
      password: await argon.hash('password'),
    };

    prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
    prismaService.user.create = jest.fn().mockResolvedValue(mockUser);

    const result = await authService.register({
      email: 'newuser@example.com',
      password: 'password',
      username: 'newuser',
    });

    expect(result).toEqual({
      message: 'Registration successful',
      data: {
        id: 'new_user_id',
        email: 'newuser@example.com',
        username: 'newuser',
      },
    });
  });

  it('should return a token when login is successful', async () => {
    const mockUser = {
      id: 'user_id',
      email: 'test@example.com',
      username: 'testuser',
      password: await argon.hash('password'),
    };

    prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toEqual({
      message: 'Login successful',
      data: {
        access_token: 'mocked_access_token',
        user: {
          id: 'user_id',
          email: 'test@example.com',
          username: 'testuser',
        },
      },
    });
  });

  it('should throw a conflict exception if email is already in use during registration', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue({
      id: 'existing_user_id',
      email: 'existing@example.com',
      username: 'existinguser',
      password: 'existing_password',
    });

    await expect(
      authService.register({
        email: 'existing@example.com',
        password: 'password',
        username: 'newuser',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
