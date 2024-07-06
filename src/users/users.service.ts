import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    const id = uuidv7();

    return this.prisma.user.create({
      data: {
        id,
        ...dto,
      },
    });
  }

  findAll(where?: Prisma.UserWhereInput) {
    const uu = this.prisma.user.findMany({ where });
    return uu;
  }

  findOne(slug: string) {
    const u = this.prisma.user.findUnique({
      where: isEmail(slug) ? { email: slug } : { id: slug },
    });

    return u;
  }
}
