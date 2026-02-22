import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '1d'); // Default to '1d'

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }

        // Ensure expiresIn is a string that jsonwebtoken can parse (e.g., "1d", "1h", "30m")
        // The type definition expects `number | StringValue | undefined`.
        // `StringValue` is typically a type alias for `string` from `jsonwebtoken` itself.
        // We ensure we're passing a string that meets the expectations.
        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as string, // Explicitly cast to string, as jsonwebtoken accepts strings like '1d'
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
