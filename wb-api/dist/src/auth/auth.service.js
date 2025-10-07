"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(email, name, password) {
        const hash = await bcrypt.hash(password, 10);
        const investor = await this.prisma.investor.create({ data: { email, name, hash, level: 'beginner' } });
        const token = jwt.sign({ sub: investor.id, email }, JWT_SECRET, { expiresIn: '7d' });
        return { investor: { id: investor.id, email, name }, token };
    }
    async login(email, password) {
        const investor = await this.prisma.investor.findUnique({ where: { email } });
        if (!investor)
            throw new Error('Invalid credentials');
        const ok = await bcrypt.compare(password, investor.hash);
        if (!ok)
            throw new Error('Invalid credentials');
        const token = jwt.sign({ sub: investor.id, email }, JWT_SECRET, { expiresIn: '7d' });
        return { investor: { id: investor.id, email: investor.email, name: investor.name }, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map