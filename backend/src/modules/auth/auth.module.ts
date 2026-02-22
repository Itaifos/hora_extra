import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresInConfig = configService.get<string>('JWT_EXPIRES_IN', '1d');

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }

        return {
          secret,
          signOptions: {
            expiresIn: expiresInConfig as any, // Use 'as any' as a last resort to bypass stubborn type error
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
