import type { ReactNode } from 'react';
import type { BreadcrumbItem } from './navigation';
import type { User } from './auth'


//Props for main app
export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User;
};

//prps for login
export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
