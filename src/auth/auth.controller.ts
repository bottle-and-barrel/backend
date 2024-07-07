import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AuthError, AuthErrorCode } from './errors/auth.error';
import { AccessTokenGuard } from './guards/access.guard';
import { Request } from 'express';
import { JwtPayload } from './type/jwt.payload';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly service: AuthService) {}

  @Post('sign-in')
  async signin(@Body() body: SigninDto) {
    try {
      return await this.service.signin(body);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof AuthError) {
        this.logger.warn(`invalid credentials request`, { error: e });
        throw new BadRequestException('Invalid credentials');
      } else {
        this.logger.error(`unexpected error on /auth/sign-in`, { error: e });
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('sign-up')
  async signup(@Body() body: SignupDto) {
    try {
      return await this.service.signup(body);
    } catch (e) {
      if (e instanceof AuthError) {
        switch (e.code) {
          case AuthErrorCode.Exists:
            throw new BadRequestException('Credentials already in use');
          default:
            this.logger.warn(`unexpected AuthError on /auth/sign-up`, {
              error: e,
            });
        }
        throw new BadRequestException('Invalid credentials');
      } else {
        this.logger.error(`unexpected error on /auth/sign-in`, { error: e });
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async me(@Req() req: Request) {
    const u = req.user as JwtPayload;
    return await this.service.account(u.id);
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request) {
    this.logger.log('user', { user: req.user });
    const u = req.user as JwtPayload;
    const token = req.user['refreshToken'];
    return await this.service.refresh(u, token);
  }
}
