"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    await app.listen(process.env.PORT || 3000);
    console.log(`API at http://localhost:${process.env.PORT || 3000}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map