import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import type { SharedData } from '@/types';

/* ======================
   NAV CONFIG PER ROLE
====================== */

const roleNavMap: Record<string, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Users and Accounts', href: '', icon: LayoutGrid },
    ],
    'accounting assistant': [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Generate Check Vouchers', href: '', icon: LayoutGrid },
    ],
    'accounting head': [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Chart of Accounts', href: '', icon: LayoutGrid },
        { title: 'To Review', href: '', icon: LayoutGrid },
    ],
    auditor: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'To Review', href: '', icon: LayoutGrid },
    ],
    SVP: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ],
};

/* ======================
   SIDEBAR COMPONENT
====================== */

export function AppSidebar() {
    const { user } = usePage<SharedData>().props;

    // Pick the first role that matches our mapping
    const navItems: NavItem[] = user
        ? user.roles.reduce<NavItem[]>((items, role) => items.length ? items : (roleNavMap[role] || []), [])
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
