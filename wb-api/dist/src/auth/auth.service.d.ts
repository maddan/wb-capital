import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    register(email: string, name: string, password: string): Promise<{
        investor: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        investor: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
}
