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
import { LayoutGrid, User, FileText, WalletCards, BookOpen, Bell } from 'lucide-react';
import AppLogo from './app-logo';
import type { SharedData } from '@/types';
import { route } from 'ziggy-js';

export function AppSidebar() {
    const { user } = usePage<SharedData>().props;
    /* ======================
    NAV CONFIG PER ROLE
    ====================== */
    const navItemsByRole: Record<string, string[]> = {
        'admin': ['dashboard', 'users', 'chartAccounts', 'disbursements', 'notifications'],
        'accounting assistant': ['dashboard', 'disbursements', 'notifications'],
        'accounting head': ['dashboard', 'chartAccounts', 'disbursements', 'notifications'],
        'auditor': ['dashboard', 'disbursements', 'notifications'],
        'SVP': ['dashboard', 'disbursements', 'notifications'],
    };

    const navItemDetails: Record<string, NavItem> = {
        dashboard: { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        users: { title: 'Users and Accounts', href: route('users'), icon: User },
        disbursements: { title: 'Disbursement', href: route('disbursements'), icon: WalletCards },
        chartAccounts: { title: 'Chart of Accounts', href: route('accounts'), icon: BookOpen },
        notifications: { title: 'Notifications', href: route('inbox'), icon: Bell },
    };

    const navItems = user?.roles
        .map(role => navItemsByRole[role] || [])
        .flat()
        .map(key => navItemDetails[key])
        .filter(Boolean);

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
