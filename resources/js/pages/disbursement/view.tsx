import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Disbursement } from '@/types/database';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText, Tag, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { VoucherTemplate } from './components/VoucherTemplate';
import { DisbursementSidebar } from './components/DisbursementSidebar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard')
    }, {
        title: 'Disbursements',
        href: route('disbursements')
    }, {
        title: 'View Disbursement',
        href: '#'
    }
];

type PageProps = {
    id: number
}

export default function View() {
    const { id, user } = usePage<any>().props
    const userRoles = user?.roles || [];

    const [disbursement, setDisbursement] = useState<Disbursement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(route('disbursements.show', { id }), {
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await res.json();
            setDisbursement(data.disbursement);
        } catch (err) {
            console.error('Failed to fetch disbursement', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAction = async (action: 'approve' | 'decline') => {
        if (!disbursement) return;

        const confirmMsg = action === 'approve'
            ? 'Are you sure you want to approve this disbursement?'
            : 'Are you sure you want to decline this disbursement?';

        if (!confirm(confirmMsg)) return;

        setIsActionLoading(true);
        try {
            const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const token = meta?.content || '';

            const endpoint = action === 'approve'
                ? route('disbursements.approve', { id: disbursement.id })
                : route('disbursements.decline', { id: disbursement.id });

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    remarks: action === 'approve' ? 'Approved through dashboard.' : 'Declined through dashboard.'
                })
            });

            if (res.ok) {
                await fetchData(); // Refresh data
            } else {
                const data = await res.json();
                alert(data.message || `Failed to ${action} disbursement.`);
            }
        } catch (err) {
            console.error(`Error during ${action}:`, err);
            alert(`An error occurred while trying to ${action} the disbursement.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const canPerformAction = () => {
        if (!disbursement || disbursement.status !== 'pending') return false;

        const step = disbursement.step;

        if (userRoles.includes('admin')) return true;

        if (step === 2 && userRoles.includes('accounting head')) return true;
        if (step === 3 && userRoles.includes('auditor')) return true;
        if (step === 4 && userRoles.includes('SVP')) return true;

        return false;
    };

    const getStatusBadgeVariant = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading Disbursement..." />
                <div className="flex h-[400px] items-center justify-center">
                    <div className="text-muted-foreground animate-pulse text-lg">Loading disbursement details...</div>
                </div>
            </AppLayout>
        );
    }

    if (!disbursement) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Disbursement Not Found" />
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <h2 className="text-2xl font-bold">Disbursement Not Found</h2>
                    <Button asChild>
                        <Link href={route('disbursements')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Disbursements
                        </Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Disbursement - ${disbursement.control_number}`} />

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={route('disbursements')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{disbursement.control_number}</h2>
                            <p className="text-muted-foreground">Detailed check voucher view for this disbursement.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge className="text-sm px-3 py-1" variant={getStatusBadgeVariant(disbursement.status)}>
                            {disbursement.status?.toUpperCase()}
                        </Badge>
                        <Button variant="outline" onClick={() => window.print()} className="hidden sm:flex items-center gap-2">
                            Print Voucher
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
                    <div className="flex flex-col gap-6 w-full">
                        {/* Summary Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Disbursement Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                                        <Tag className="h-3 w-3" />
                                        Title
                                    </p>
                                    <p className="text-sm font-semibold">{disbursement.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Date Created
                                    </p>
                                    <p className="text-sm font-semibold">{formatDate(disbursement.created_at)}</p>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                                        <Info className="h-3 w-3" />
                                        Description
                                    </p>
                                    <p className="text-sm text-foreground bg-muted/30 p-2 rounded border border-border/50">
                                        {disbursement.description || 'No description provided.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Voucher - Paper A4 Look */}
                        <div className="overflow-x-auto pb-8 flex justify-center bg-gray-100/50 rounded-xl border p-4 sm:p-8">
                            <VoucherTemplate disbursement={disbursement} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sticky top-6">
                        <DisbursementSidebar
                            currentStep={disbursement.step}
                            tracking={disbursement.tracking}
                            attachments={disbursement.attachments}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            {canPerformAction() && (
                <div className="fixed bottom-8 right-8 flex items-center gap-3 z-50 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Button
                        variant="outline"
                        onClick={() => handleAction('decline')}
                        disabled={isActionLoading}
                        className="h-12 px-6 rounded-full border-destructive text-destructive hover:bg-destructive/5 shadow-lg bg-white font-semibold"
                    >
                        {isActionLoading ? 'Processing...' : 'Decline'}
                    </Button>
                    <Button
                        onClick={() => handleAction('approve')}
                        disabled={isActionLoading}
                        className="h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl font-semibold scale-105 transition-transform hover:scale-110 active:scale-95"
                    >
                        {isActionLoading ? 'Processing...' : 'Approve Disbursement'}
                    </Button>
                </div>
            )}
        </AppLayout>
    );
}
