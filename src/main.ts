import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { SwaggerService } from './swagger/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
      
    }),
  );

  // Swagger setup using our custom service
  const swaggerService = new SwaggerService();
  swaggerService.setup(app);

  // Use 0 to let the system assign an available port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
  await app.listen(port);
  const assignedPort = app.getHttpServer().address().port;
  console.log(`Application is running on: http://localhost:${assignedPort}`);
  console.log(`Swagger documentation is available on: http://localhost:${assignedPort}/api/docs`);
}
bootstrap();