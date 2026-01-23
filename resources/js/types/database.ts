export interface Account {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    status: string;
}

export interface Role {
    id: number;
    name: string;
}
