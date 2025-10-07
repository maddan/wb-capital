
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, name: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const investor = await this.prisma.investor.create({ data: { email, name, hash, level: 'beginner' } });
    const token = jwt.sign({ sub: investor.id, email }, JWT_SECRET, { expiresIn: '7d' });
    return { investor: { id: investor.id, email, name }, token };
  }

  async login(email: string, password: string) {
    const investor = await this.prisma.investor.findUnique({ where: { email } });
    if (!investor) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, investor.hash);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ sub: investor.id, email }, JWT_SECRET, { expiresIn: '7d' });
    return { investor: { id: investor.id, email: investor.email, name: investor.name }, token };
  }
}
