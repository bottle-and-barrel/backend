import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ManufacturerModule } from './manufacturer/manufacturer.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [],
  providers: [PrismaModule, ManufacturerModule],
})
export class AppModule {}
