"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const deals_module_1 = require("./deals/deals.module");
const finance_module_1 = require("./finance/finance.module");
const glossary_module_1 = require("./glossary/glossary.module");
const auth_module_1 = require("./auth/auth.module");
const ingest_module_1 = require("./ingest/ingest.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, deals_module_1.DealsModule, finance_module_1.FinanceModule, glossary_module_1.GlossaryModule, auth_module_1.AuthModule, ingest_module_1.IngestModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map