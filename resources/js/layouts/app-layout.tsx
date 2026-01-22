//app layout is the layout we use when user is logged in
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Auth } from '@/types/auth'


export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage<Auth>().props
    return (
        <AppLayoutTemplate
            breadcrumbs={breadcrumbs}
            {...props}
            auth={auth}
        >
            {children}
        </AppLayoutTemplate>
    );
};