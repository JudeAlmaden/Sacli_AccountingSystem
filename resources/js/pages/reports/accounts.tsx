import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, PieChart, Search, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusIndicator } from '@/components/status-indicator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Account Reports', href: route('accounts.reports') },
];

type Period = 'daily' | 'monthly' | 'yearly';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface AccountWithUsage {
    id: number;
    account_name: string;
    account_code: string;
    account_type: string;
    sub_account_type?: string | null;
    account_description?: string | null;
    account_normal_side?: string | null;
    status: string;
    group?: {
        name: string;
        grp_code: string | null;
    } | null;
    usage_count: number;
    total_debit?: number;
    total_credit?: number;
}

interface ReportData {
    period: Period;
    date_from: string | null;
    date_to: string | null;
    summary: {
        total: number;
        active: number;
        inactive: number;
        by_type: Record<string, number>;
    };
    accounts_with_usage: PaginatedData<AccountWithUsage>;
}

function defaultDateFrom(): string {
    const d = new Date();
    d.setDate(1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function defaultDateTo(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const TYPE_COLORS: Record<string, { bg: string; fill: string }> = {
    Assets: { bg: 'bg-blue-100 dark:bg-blue-950', fill: 'bg-blue-600' },
    Liabilities: { bg: 'bg-amber-100 dark:bg-amber-950', fill: 'bg-amber-600' },
    Equity: { bg: 'bg-emerald-100 dark:bg-emerald-950', fill: 'bg-emerald-600' },
    Revenue: { bg: 'bg-purple-100 dark:bg-purple-950', fill: 'bg-purple-600' },
    Expenses: { bg: 'bg-rose-100 dark:bg-rose-950', fill: 'bg-rose-600' },
};

interface Props {
    data: ReportData;
    filters: {
        period?: Period;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function AccountReportPage({ data, filters }: Props) {
    const [period, setPeriod] = useState<Period>(filters.period || 'monthly');
    const [dateFrom, setDateFrom] = useState<string | null>(filters.date_from || defaultDateFrom());
    const [dateTo, setDateTo] = useState<string | null>(filters.date_to || defaultDateTo());
    const [search, setSearch] = useState<string>(filters.search || '');

    const handleApply = (newSearch?: string) => {
        const s = newSearch !== undefined ? newSearch : search;
        const params: Record<string, string> = { period };
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (s) params.search = s;

        router.get(route('accounts.reports'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                handleApply(search);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const accounts = data?.accounts_with_usage?.data || [];
    const totalAccounts = data?.summary?.total || 1;
    const activeAccounts = data?.summary?.active || 0;
    const inactiveAccounts = data?.summary?.inactive || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Reports" />
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Account Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Chart of accounts summary, usage analysis, and account breakdown
                    </p>
                </div>

                {/* Time range */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Time range</CardTitle>
                        <CardDescription>
                            Optionally filter usage and amounts by date range
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Period</Label>
                            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">From</Label>
                            <DatePicker
                                value={dateFrom ?? ''}
                                onChange={(v) => setDateFrom(v || null)}
                                placeholder="From (optional)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">To</Label>
                            <DatePicker
                                value={dateTo ?? ''}
                                onChange={(v) => setDateTo(v || null)}
                                placeholder="To (optional)"
                            />
                        </div>
                        <Button onClick={() => handleApply()}>Apply Filters</Button>
                    </CardContent>
                </Card>

                {data && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total accounts</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data.summary.total}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {data.summary.active} active · {data.summary.inactive} inactive
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data.summary.active}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.round((activeAccounts / totalAccounts) * 100)}% of total accounts
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Inactive Accounts</CardTitle>
                                    <XCircle className="h-4 w-4 text-rose-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data.summary.inactive}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.round((inactiveAccounts / totalAccounts) * 100)}% of total accounts
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">By type count</CardTitle>
                                    <PieChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm">
                                        {Object.entries(data.summary.by_type || {}).length > 0
                                            ? Object.entries(data.summary.by_type)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 3)
                                                .map(([type, count]) => (
                                                    <div key={type} className="flex justify-between gap-2">
                                                        <span className="text-muted-foreground truncate">{type}</span>
                                                        <span className="font-medium">{count}</span>
                                                    </div>
                                                ))
                                            : '—'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Basic Visual Charts section */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Account Type Distribution Bar Chart */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-primary" />
                                            Account Type Distribution
                                        </CardTitle>
                                        <CardDescription>Visual breakdown of accounts by category</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(data.summary.by_type || {})
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([type, count]) => {
                                            const pct = Math.round((count / totalAccounts) * 100);
                                            const colors = TYPE_COLORS[type] || { bg: 'bg-gray-100', fill: 'bg-primary' };
                                            return (
                                                <div key={type} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-medium">{type}</span>
                                                        <span className="text-muted-foreground">{count} accounts ({pct}%)</span>
                                                    </div>
                                                    <div className={`h-2.5 w-full rounded-full ${colors.bg} overflow-hidden`}>
                                                        <div
                                                            className={`h-full rounded-full ${colors.fill} transition-all duration-500`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </CardContent>
                            </Card>

                            {/* Account Status Ratio Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <PieChart className="h-4 w-4 text-emerald-600" />
                                        Status Ratio Breakdown
                                    </CardTitle>
                                    <CardDescription>Active vs Inactive status proportion</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-emerald-700 dark:text-emerald-400">Active ({data.summary.active})</span>
                                                <span className="font-semibold">{Math.round((activeAccounts / totalAccounts) * 100)}%</span>
                                            </div>
                                            <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-500"
                                                    style={{ width: `${(activeAccounts / totalAccounts) * 100}%` }}
                                                />
                                                <div
                                                    className="h-full bg-rose-400 transition-all duration-500"
                                                    style={{ width: `${(inactiveAccounts / totalAccounts) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Active</span>
                                                <span>Inactive ({data.summary.inactive})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="rounded-lg border bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                                            <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Active Accounts</div>
                                            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{data.summary.active}</div>
                                            <div className="text-[11px] text-muted-foreground">Operational in system</div>
                                        </div>
                                        <div className="rounded-lg border bg-rose-50/50 p-3 dark:bg-rose-950/20">
                                            <div className="text-xs font-medium text-rose-800 dark:text-rose-300">Inactive Accounts</div>
                                            <div className="text-xl font-bold text-rose-700 dark:text-rose-400">{data.summary.inactive}</div>
                                            <div className="text-[11px] text-muted-foreground">Disabled or archived</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart of Accounts & Usage Table (Matching http://127.0.0.1:8000/dashboard/chart-of-accounts) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Accounts and Usage</CardTitle>
                                <CardDescription>
                                    {data.date_from || data.date_to
                                        ? 'Usage and amounts in selected time range'
                                        : 'Each account and how many line items reference it'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative max-w-lg">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="Search accounts..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="rounded-sm border-gray-300 border-[1.7px] bg-white pl-9"
                                    />
                                </div>

                                <div className="rounded-sm border bg-card overflow-hidden py-0 pb-2">
                                    <div className="overflow-x-auto">
                                        <Table className="w-full">
                                            <TableHeader className="border-0">
                                                <TableRow className="bg-table-head hover:bg-table-head border-0">
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head first:rounded-tl-sm">Code</TableHead>
                                                    <TableHead className="w-[18%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Name</TableHead>
                                                    <TableHead className="w-[12%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Group</TableHead>
                                                    <TableHead className="w-[10%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Type</TableHead>
                                                    <TableHead className="w-[12%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Sub-Type</TableHead>
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Side</TableHead>
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head">Status</TableHead>
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head text-right">Usage Count</TableHead>
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head text-right">Debit</TableHead>
                                                    <TableHead className="w-[8%] px-3 py-5 text-white text-base font-extrabold bg-table-head text-right last:rounded-tr-sm">Credit</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {accounts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={10} className="text-center h-24 text-muted-foreground px-3">
                                                            No accounts found.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    accounts.map((acc) => (
                                                        <TableRow key={acc.id} className="h-16">
                                                            <TableCell className="font-mono font-medium px-3 text-sm">{acc.account_code}</TableCell>
                                                            <TableCell className="px-3">
                                                                <Link href={route('accounts.show', acc.id)} className="hover:underline font-medium text-primary">
                                                                    {acc.account_name}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell className="px-3 text-xs">
                                                                {acc.group?.name ? (
                                                                    <div className="text-blue-600 font-medium leading-tight">
                                                                        <div>{acc.group.name}</div>
                                                                        {acc.group.grp_code && (
                                                                            <div className="text-[10px] text-muted-foreground">({acc.group.grp_code})</div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">-</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="px-3 text-sm">{acc.account_type}</TableCell>
                                                            <TableCell className="px-3 text-xs text-muted-foreground truncate" title={acc.sub_account_type || '-'}>
                                                                {acc.sub_account_type || '-'}
                                                            </TableCell>
                                                            <TableCell className="px-3 text-sm capitalize">{acc.account_normal_side || '-'}</TableCell>
                                                            <TableCell className="px-3">
                                                                <StatusIndicator status={acc.status as 'active' | 'inactive'} />
                                                            </TableCell>
                                                            <TableCell className="px-3 text-right font-medium">{acc.usage_count}</TableCell>
                                                            <TableCell className="px-3 text-right">{formatCurrency(acc.total_debit ?? 0)}</TableCell>
                                                            <TableCell className="px-3 text-right">{formatCurrency(acc.total_credit ?? 0)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Pagination Bar */}
                                <div className="flex items-center justify-between space-x-2 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {data.accounts_with_usage.from || 0} to {data.accounts_with_usage.to || 0} of {data.accounts_with_usage.total || 0} entries
                                    </div>
                                    <div className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            disabled={!data.accounts_with_usage.prev_page_url}
                                        >
                                            <Link
                                                href={data.accounts_with_usage.prev_page_url || '#'}
                                                preserveState
                                                preserveScroll
                                            >
                                                Previous
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            disabled={!data.accounts_with_usage.next_page_url}
                                        >
                                            <Link
                                                href={data.accounts_with_usage.next_page_url || '#'}
                                                preserveState
                                                preserveScroll
                                            >
                                                Next
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
