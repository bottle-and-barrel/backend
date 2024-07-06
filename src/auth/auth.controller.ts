import { Body, Controller, Get, Post } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('sign-in')
  async signin(@Body() body: SigninDto) {
    return this.service.signin(body);
  }

  @Post('sign-up')
  async signup(@Body() body: SignupDto) {
    return this.service.signup(body);
  }
}
