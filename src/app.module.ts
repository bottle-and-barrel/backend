import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    AuthModule,
    ManufacturerModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaModule],
})
export class AppModule {}
