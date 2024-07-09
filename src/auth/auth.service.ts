import { UsersService } from '@/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './type/jwt.payload';
import { AuthError, AuthErrorCode } from './errors/auth.error';
import { RedisService } from '@/redis/redis.service';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.usersService.findOne(dto.email);
    if (!user) {
      throw new AuthError(
        `User with email=${dto.email} not found`,
        AuthErrorCode.NotFound,
      );
    }

    const isValid = await this.verifyPassword(dto.password, user.password);
    if (!isValid) {
      throw new AuthError('Invalid password', AuthErrorCode.InvalidCredentials);
    }

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async signup(dto: SignupDto) {
    const emailCheck = await this.usersService.findOne(dto.email);
    if (emailCheck) {
      throw new AuthError('Email already in use', AuthErrorCode.Exists);
    }

    const phoneCheck = await this.usersService.findOne(dto.phone);
    if (phoneCheck) {
      throw new AuthError('Phone already in use', AuthErrorCode.Exists);
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.usersService.create({
      role: 'USER',
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstname,
      lastName: dto.lastname,
      middleName: dto.middlename,
      phone: dto.phone,
    });

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async logout(user: JwtPayload) {
    return this.redis.clear(user.id);
  }

  async account(userId: string) {
    const u = this.usersService.findOne(userId);
    return u;
  }

  async refresh(payload: JwtPayload, token: string) {
    const currentSession = await this.redis.get<string>(payload.id);

    const isValid = token === currentSession;
    if (!isValid) {
      throw new AuthError(
        'refresh token not found for user=' + payload.id,
        AuthErrorCode.NotFound,
      );
    }

    this.logger.verbose('tokens matches', {
      token,
      currentSession,
      isValid,
    });

    return await this.getTokens(payload.id, payload.email);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, Number(process.env.BCRYPT_SALT));
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async getTokens(userId: string, email: string) {
    const payload: JwtPayload = {
      id: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    this.redis.set(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
