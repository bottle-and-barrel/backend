import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
