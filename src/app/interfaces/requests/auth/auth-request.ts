export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    active: boolean;
    email: string;
    roles: string[];
    carrierIds: number[];
}

export interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export interface EditUserRequest {
    userId: string;
    username: string;
    email: string;
    active: boolean;
    roles: string[];
    carrierIds: number[];
}