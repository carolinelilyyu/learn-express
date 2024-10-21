import { Request } from 'express';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export interface UserRequest extends Request{
    users?: User[];
}
