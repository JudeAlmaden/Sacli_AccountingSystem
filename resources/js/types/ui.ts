import type { ReactNode } from 'react';
import type { BreadcrumbItem } from './navigation';
import type { Auth } from './auth'


//Props for main app
export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    auth?: Auth;
};

//prps for login
export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
