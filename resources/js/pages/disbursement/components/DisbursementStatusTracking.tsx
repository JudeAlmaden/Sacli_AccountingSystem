import { DottedSeparator } from '@/components/dotted-line';
import { Card } from '@/components/ui/card';
import { DisbursementTracking } from '@/types/database';
import { useState } from 'react';

interface StatusTrackingProps {
    currentStep?: number;
    tracking?: DisbursementTracking[];
}

export function DisbursementStatusTracking({ currentStep = 1, tracking = [] }: StatusTrackingProps) {
    const [expandedRemarks, setExpandedRemarks] = useState<number[]>([]);
    const steps = [
        { name: 'Accounting Assistant', role: 'accounting assistant' },
        { name: 'Accounting Head', role: 'accounting head' },
        { name: 'Auditor', role: 'auditor' },
        { name: 'SVP', role: 'SVP' },
    ];

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="border-border bg-card p-4">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-foreground">Status Tracking</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Approval workflow progress</p>
            </div>
             <DottedSeparator className='-mt-5'/>
            <div className="relative">
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                <div className="space-y-5">
                    {steps.map((step, index) => {
                        const stepNum = index + 1;
                        const trackingInfo = tracking.find(t => t.step === stepNum);
                        const isCompleted = trackingInfo?.action === 'approved';
                        const isPending = trackingInfo?.action === 'pending' || (currentStep === stepNum && !trackingInfo);
                        const isRejected = trackingInfo?.action === 'rejected';
                        
                        let circleClass = 'bg-gray-200';
                        let textColor = 'text-muted-foreground';
                        let statusText = 'Awaiting';
                        let dotClass = 'bg-gray-400';

                        if (isCompleted) {
                            circleClass = 'bg-green-500';
                            textColor = 'text-foreground';
                            statusText = `Approved by ${trackingInfo?.handler?.name || 'System'}`;
                        } else if (isRejected) {
                            circleClass = 'bg-destructive';
                            textColor = 'text-destructive';
                            statusText = `Rejected by ${trackingInfo?.handler?.name || 'System'}`;
                        } else if (isPending) {
                            circleClass = 'bg-yellow-500';
                            textColor = 'text-foreground';
                            statusText = 'Pending approval';
                            dotClass = 'bg-white';
                        }

                        return (
                            <div key={step.role} className="flex items-start gap-3 relative">
                                <div className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full z-10 ${circleClass}`}>
                                    {isPending && (
                                        <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-75 animate-[ping_2s_ease-in-out_infinite]"></div>
                                    )}
                                    {isCompleted ? (
                                        <svg
                                            className="relative h-2.5 w-2.5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isRejected ? (
                                        <svg
                                            className="relative h-2.5 w-2.5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <div className={`h-1.5 w-1.5 rounded-full ${dotClass}`}></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${textColor}`}>
                                        {step.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/70 font-medium mt-0.5">
                                        {statusText}
                                    </p>
                                    {trackingInfo?.acted_at && (
                                        <p className="text-[11px] text-muted-foreground/70">
                                            {formatDate(trackingInfo.acted_at)}
                                        </p>
                                    )}
                                    {trackingInfo?.remarks && (
                                        <div className="mt-1">
                                            <button
                                                onClick={() => {
                                                    setExpandedRemarks(prev => 
                                                        prev.includes(stepNum) 
                                                            ? prev.filter(s => s !== stepNum)
                                                            : [...prev, stepNum]
                                                    );
                                                }}
                                                className="flex items-center gap-1 text-[12px] text-green-700 transition-colors"
                                            >
                                                <svg
                                                    className={`h-3 w-3 transition-transform ${expandedRemarks.includes(stepNum) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                                <span>View remarks</span>
                                            </button>
                                            {expandedRemarks.includes(stepNum) && (
                                                <p className="text-xs text-muted-foreground italic mt-1 bg-muted/50 p-1.5 rounded border-l-2 border-border">
                                                    "{trackingInfo.remarks}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
