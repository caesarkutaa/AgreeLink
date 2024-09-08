import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a success message with the token and user data', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = {
        message: 'Login successful',
        data: {
          access_token: 'mocked_access_token',
          user: {
            id: 'user_id',
            email: 'test@example.com',
            username: 'testuser',
          },
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        );

      await expect(authController.login(loginDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('register', () => {
    it('should return a success message when registration is successful', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      };

      const result = {
        message: 'Registration successful',
        data: {
          id: 'user_id',
          email: 'newuser@example.com',
          username: 'newuser',
        },
      };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(registerDto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error if registration fails', async () => {
      const registerDto: RegisterDto = {
        email: 'existinguser@example.com',
        password: 'password123',
        username: 'existinguser',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new HttpException('Conflict', HttpStatus.CONFLICT));

      await expect(authController.register(registerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
