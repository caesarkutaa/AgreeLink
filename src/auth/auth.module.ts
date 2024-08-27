import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // UsersModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, Logger],
  controllers: [AuthController],
})
export class AuthModule {}
