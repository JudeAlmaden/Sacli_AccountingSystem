export interface Account {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    status: boolean;
}

export interface Role {
    id: number;
    name: string;
}
