import {
  Injectable,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {}

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for email: ${dto.email}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user) {
        this.logger.warn(`User not found for email: ${dto.email}`);
        throw new NotFoundException('User not found');
      }

      const passwordMatches = await argon.verify(user.password, dto.password);
      if (!passwordMatches) {
        this.logger.warn(`Invalid credentials for email: ${dto.email}`);
        throw new ForbiddenException('Credentials incorrect');
      }

      const token = await this.signToken(user.id, user.email);

      this.logger.log(
        `User Login successfully - ID:${user.id}, EMAIL:${user.username} `,
      );
      return {
        message: 'Login successful',
        data: {
          access_token: token,
          user: { id: user.id, email: user.email, username: user.username },
        },
      };
    } catch (error) {
      this.logger.error(`Login error - email: ${dto.email}`, error.stack);
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log(`Register attempt - email: ${registerDto.email}`);
      const { email, password, username } = registerDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        this.logger.warn(`Email already in use - email: ${email}`);
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await argon.hash(password);
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      if (!newUser)
        return new HttpException(
          'Error occured during signup',
          HttpStatus.BAD_REQUEST,
        );
      delete newUser.password;
      this.logger.log(`User created successfully - id: ${newUser.id}`);
      return {
        message: 'Registration successful',
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      };
    } catch (error) {
      this.logger.error(
        `Register error - email: ${registerDto.email}`,
        error.stack,
      );
      if (error instanceof ConflictException) {
        throw error; // Re-throw ConflictException directly
      } else {
        throw new HttpException(
          'Error creating user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async signToken(id: string, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const Token = await this.jwtService.signAsync(payload, {
      expiresIn: '5d',
      secret: secret,
    });

    return Token;
  }
}
