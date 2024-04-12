export interface CustomUser{
    id: number;
    password: string;
    last_login: Date | null;
    is_superuser: boolean;
    username: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
}