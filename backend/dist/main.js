"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app/app.module");
const swagger_service_1 = require("./swagger/swagger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true
    }));
    const swaggerService = new swagger_service_1.SwaggerService();
    swaggerService.setup(app);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
    await app.listen(port);
    const assignedPort = app.getHttpServer().address().port;
    console.log(`Application is running on: http://localhost:${assignedPort}`);
    console.log(`Swagger documentation is available on: http://localhost:${assignedPort}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map