import { Card } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { FileText, Image as ImageIcon, X, Paperclip, FileIcon, Plus, Download, Loader2, AlertCircle } from 'lucide-react';
import { DisbursementAttachment as DBAttachment } from '@/types/database';

interface FileWithStatus {
    file: File;
    status: 'uploading' | 'completed' | 'error';
    tempId?: string;
    errorMessage?: string;
}

interface DisbursementAttachmentProps {
    onFilesChange?: (tempIds: string[]) => void;
    attachments?: DBAttachment[];
    mode?: 'generate' | 'view';
}

export function DisbursementAttachment({ onFilesChange, attachments = [], mode = 'generate' }: DisbursementAttachmentProps) {
    const [filesWithStatus, setFilesWithStatus] = useState<FileWithStatus[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get CSRF token for async uploads
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    const token = meta?.content || '';

    const uploadFile = async (file: File, index: number) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/attachments/upload-temp', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle Laravel validation errors (422)
                if (response.status === 422 && data.errors?.file) {
                    throw new Error(data.errors.file[0]);
                }

                // Show status code for other errors (like 413 Payload Too Large)
                throw new Error(data.error || data.message || `Upload failed (Status: ${response.status})`);
            }

            setFilesWithStatus(prev => {
                const next = [...prev];
                if (next[index]) {
                    next[index] = { ...next[index], status: 'completed', tempId: data.id };
                }
                return next;
            });
        } catch (error: any) {
            setFilesWithStatus(prev => {
                const next = [...prev];
                if (next[index]) {
                    next[index] = { ...next[index], status: 'error', errorMessage: error.message };
                }
                return next;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const startIndex = filesWithStatus.length;

            const newWithStatus: FileWithStatus[] = newFiles.map(f => ({
                file: f,
                status: 'uploading'
            }));

            setFilesWithStatus(prev => [...prev, ...newWithStatus]);

            newFiles.forEach((f, i) => {
                uploadFile(f, startIndex + i);
            });
        }
    };

    useEffect(() => {
        if (onFilesChange && mode === 'generate') {
            const completedIds = filesWithStatus
                .filter(f => f.status === 'completed' && f.tempId)
                .map(f => f.tempId as string);
            onFilesChange(completedIds);
        }
    }, [filesWithStatus, onFilesChange, mode]);

    const removeFile = async (index: number) => {
        const target = filesWithStatus[index];

        // If it was already uploaded, notify server to revert
        if (target.status === 'completed' && target.tempId) {
            try {
                await fetch('/attachments/revert-temp', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    body: target.tempId
                });
            } catch (e) {
                console.error('Failed to revert upload', e);
            }
        }

        setFilesWithStatus(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (fileName: string, fileType?: string) => {
        const lowerName = fileName.toLowerCase();
        if (fileType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/.test(lowerName))
            return <ImageIcon className="h-4 w-4 text-blue-500" />;
        if (fileType === 'application/pdf' || lowerName.endsWith('.pdf'))
            return <FileText className="h-4 w-4 text-red-500" />;
        if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls'))
            return <FileIcon className="h-4 w-4 text-green-600" />;
        if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc'))
            return <FileIcon className="h-4 w-4 text-blue-600" />;
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card className="border-border bg-card p-6 flex flex-col min-h-[200px]">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                </h3>
                <p className="text-xs text-muted-foreground mt-1 text-balance">
                    {mode === 'generate' ? 'Upload supporting documents (PDF, Images, Excel, Word)' : 'Supporting documents for this disbursement'}
                </p>
            </div>

            {mode === 'generate' && (
                <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer mb-6 group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept="image/*,.pdf,.docx,.doc,.xlsx,.xls"
                    />
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Upload Files</p>
                            <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
                {/* Existing Attachments (View Mode) */}
                {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-colors group">
                        <div className="shrink-0">
                            {getFileIcon(attachment.file_name, attachment.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium truncate text-foreground">{attachment.file_name}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{attachment.file_type.split('/')[1] || 'FILE'}</p>
                        </div>
                        <a
                            href={`/attachments/download/${attachment.id}`}
                            className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                            title="Download"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download className="h-3.5 w-3.5" />
                        </a>
                    </div>
                ))}

                {/* Selected Files with Status (Generate Mode) */}
                {mode === 'generate' && filesWithStatus.map((item, index) => (
                    <div key={`${item.file.name}-${index}`} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors group ${item.status === 'error' ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/20 hover:bg-muted/40'
                        }`}>
                        <div className="shrink-0">
                            {item.status === 'uploading' ? (
                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            ) : item.status === 'error' ? (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : (
                                getFileIcon(item.file.name, item.file.type)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-foreground">{item.file.name}</p>
                            <p className={`text-[10px] ${item.status === 'error' ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                {item.status === 'uploading' ? 'Uploading...' :
                                    item.status === 'error' ? (item.errorMessage || 'Failed') :
                                        formatSize(item.file.size)}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                            }}
                            className="p-1 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}

                {attachments.length === 0 && filesWithStatus.length === 0 && (
                    <div className="text-center py-8 opacity-40 italic">
                        <p className="text-xs text-muted-foreground">No files attached.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
