import { Card } from '@/components/ui/card';
import { DisbursementTracking } from '@/types/database';

interface StatusTrackingProps {
    currentStep?: number;
    tracking?: DisbursementTracking[];
}

export function DisbursementStatusTracking({ currentStep = 1, tracking = [] }: StatusTrackingProps) {
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
        <Card className="border-border bg-card p-6">
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground">Status Tracking</h3>
                <p className="text-xs text-muted-foreground mt-1">Approval workflow progress</p>
            </div>
            <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>

                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const stepNum = index + 1;
                        const trackingInfo = tracking.find(t => t.step === stepNum);
                        const isCompleted = trackingInfo?.action === 'approved';
                        const isPending = trackingInfo?.action === 'pending' || (currentStep === stepNum && !trackingInfo);
                        const isRejected = trackingInfo?.action === 'rejected';

                        // Status styling
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
                            <div key={step.role} className="flex items-start gap-4 relative">
                                <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full z-10 mt-0.5 ${circleClass}`}>
                                    {isPending && (
                                        <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-75 animate-[ping_2s_ease-in-out_infinite]"></div>
                                    )}
                                    {isCompleted ? (
                                        <svg
                                            className="relative h-3 w-3 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isRejected ? (
                                        <svg
                                            className="relative h-3 w-3 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <div className={`h-2 w-2 rounded-full ${dotClass}`}></div>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${textColor}`}>
                                        {step.name}
                                    </p>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                                            {statusText}
                                        </p>
                                        {trackingInfo?.acted_at && (
                                            <p className="text-[10px] text-muted-foreground">
                                                {formatDate(trackingInfo.acted_at)}
                                            </p>
                                        )}
                                        {trackingInfo?.remarks && (
                                            <p className="text-[11px] text-muted-foreground italic mt-1 bg-muted/50 p-1.5 rounded border-l-2 border-border">
                                                "{trackingInfo.remarks}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
