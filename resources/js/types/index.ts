export type * from './auth';
export type * from './navigation';
export type * from './ui';
import type { User } from './auth';

export type SharedData = {
    name: string;
    user: User;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
