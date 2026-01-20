import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pos-system-pizza-frontend-ofzd.vercel.app'
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('Point of Sale System with Raw Material Management')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
  console.log('🚀 Server running on http://localhost:5000');
  console.log('📚 Swagger docs at http://localhost:5000/api');
}
bootstrap();
