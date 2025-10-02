"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Rotina Diária API')
    .setDescription('API para gerenciamento de rotinas diárias')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas aos usuários')
    .addBearerAuth()
    .build();
//# sourceMappingURL=swagger.config.js.map