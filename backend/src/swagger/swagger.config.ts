import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Rotina Diária API')
  .setDescription('API para gerenciamento de rotinas diárias')
  .setVersion('1.0')
  .addTag('users', 'Operações relacionadas aos usuários')
  .addBearerAuth()
  .build();