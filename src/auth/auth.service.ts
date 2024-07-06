import { UsersService } from '@/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './type/jwt.payload';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.usersService.findOne(dto.email);

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await this.verifyPassword(dto.password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async signup(dto: SignupDto) {
    const userExists = await this.usersService.findOne(dto.email);
    if (userExists) {
      throw new Error('User already exists');
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

  async logout() {}

  async refresh() {}

  async validate() {}

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
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

    return { accessToken, refreshToken };
  }
}
