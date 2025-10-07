import { AuthService } from './auth.service';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(body: any): Promise<{
        investor: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
    login(body: any): Promise<{
        investor: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
}
