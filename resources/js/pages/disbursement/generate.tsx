import { useState } from 'react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { BreadcrumbItem } from '@/types';
import AccountingEntryTable from '@/components/accounting-entry-table';
import { DisbursementAttachment } from './components/DisbursementAttachment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Disbursements',
        href: route('disbursements'),
    },
    {
        title: 'Generate',
        href: route('disbursement.generate'),
    },
];

export default function GenerateDisbursement() {
    const today = new Date().toISOString().split('T')[0];
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(today);
    const [description, setDescription] = useState('');
    const [disbursementData, setDisbursementData] = useState<any>(null);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Get CSRF token
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    const token = meta?.content || '';

    const handleSave = () => {
        if (!disbursementData) return;
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();

        // Append basic info
        formData.append('title', disbursementData.title);
        formData.append('date', disbursementData.date);
        formData.append('description', disbursementData.description);

        // Append accounting entries
        formData.append('accounts', JSON.stringify(disbursementData.accounts));

        // Append temp IDs of uploaded files
        attachments.forEach((tempId) => {
            formData.append('attachments[]', tempId);
        });

        fetch(route('disbursements.store'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json',
            },
            body: formData,
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 422) {
                        setErrors(data.errors || {});
                        throw new Error('Validation failed');
                    }
                    throw new Error(data.message || 'Something went wrong');
                }
                return data;
            })
            .then(data => {
                if (data.id) {
                    router.visit(route('disbursement.view', { id: data.id }));
                }
            })
            .catch(error => {
                console.error('Error saving disbursement:', error);
                setIsSubmitting(false);
            });
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Disbursement" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <AccountingEntryTable
                    title={title}
                    date={date}
                    description={description}
                    onTitleChange={setTitle}
                    onDateChange={setDate}
                    onDescriptionChange={setDescription}
                    onDataChange={setDisbursementData}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    saveButtonText={isSubmitting ? "Saving..." : "Save Disbursement"}
                    isLoading={isSubmitting}
                    errors={errors}
                />

                <div className="space-y-6">
                    <DisbursementAttachment onFilesChange={setAttachments} />
                </div>
            </div>
        </AppLayout>
    );
}
