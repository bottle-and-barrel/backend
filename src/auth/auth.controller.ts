import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AuthError, AuthErrorCode } from './errors/auth.error';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly service: AuthService) {}

  @Post('sign-in')
  async signin(@Body() body: SigninDto) {
    try {
      return await this.service.signin(body);
    } catch (e) {
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
}
