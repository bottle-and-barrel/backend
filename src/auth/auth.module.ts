import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AccessStrategy, RefreshStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
