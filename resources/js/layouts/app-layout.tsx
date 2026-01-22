//app layout is the layout we use when user is logged in
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { User } from '@/types/auth'
import type { SharedData } from '@/types';


interface PageProps {
    user: User;
    [key: string]: any;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { user } = usePage<SharedData>().props;
    return (
        <AppLayoutTemplate
            breadcrumbs={breadcrumbs}
            {...props}
            user={user}
        >
            {children}
        </AppLayoutTemplate>
    );
};