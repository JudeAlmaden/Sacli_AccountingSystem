import { route } from 'ziggy-js';
import { dashboard } from '@/routes';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types/database';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    //Get the CSRF token from the meta tag
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    const token = meta?.content || '';

    //Get the accounts from the API
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({
        total_users: 0,
        active_users: 0,
        inactive_users: 0,
        admin_users: 0,
    });

     useEffect(() => {
        const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token,
            };

            //Mabilisang Fetch vro, ganto nalang tayo mag Fetch (No N+1 Query)
            Promise.all([
                fetch('/api/users', { headers }).then(res => res.json()),
                fetch('/api/users/stats', { headers }).then(res => res.json())
            ]).then(([usersData, statsData]) => {
                console.log('Users data:', usersData);
                console.log('Stats data:', statsData);
                console.log('Users array length:', usersData.data?.length);
                console.log('First user:', usersData.data?.[0]);
                setUsers(usersData.data || []);
                setStats(statsData);
            }).catch(error => {
                console.error('Failed to fetch data:', error);
            });
        }, [token]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="flex flex-col gap-6 py-6">
              
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Users and Accounts</h1>
                    <p className="text-muted-foreground">Manage user accounts, roles, and permissions here</p>
                </div>

               
                <div className="relative flex items-center justify-between bg-card border rounded-xl py-8 px-6">
                   
                    <div className="absolute inset-y-0 left-1/4 w-0.5 border-l-2 border-dashed border-border opacity-60"></div>
                    <div className="absolute inset-y-0 left-2/4 w-0.5 border-l-2 border-dashed border-border opacity-60"></div>
                    <div className="absolute inset-y-0 left-3/4 w-0.5 border-l-2 border-dashed border-border opacity-60"></div>

                   
                    <div className="flex-1 flex items-center px-4 first:pl-0">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <p className="text-2xl font-bold">{stats.total_users}</p>
                        </div>
                    </div>
  
                    <div className="flex-1 flex items-center px-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active_users}</p>
                        </div>
                    </div>

                  
                    <div className="flex-1 flex items-center px-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Inactive Users</p>
                            <p className="text-2xl font-bold text-red-600">{stats.inactive_users}</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center px-4 last:pr-0">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.admin_users}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">User Accounts</h2>
                        <Button variant="outline">Add User</Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                                                    {user.roles?.map((role) => role.name).join(', ') || 'No role'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    user.status === 'active' 
                                                        ? 'bg-green-50 text-green-700' 
                                                        : 'bg-red-50 text-red-700'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
