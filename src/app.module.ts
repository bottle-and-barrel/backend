import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    AuthModule,
    ManufacturerModule,
    UsersModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [PrismaModule],
})
export class AppModule {}
