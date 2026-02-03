import { DisbursementAttachment } from './DisbursementAttachment';
import { DisbursementStatusTracking } from './DisbursementStatusTracking';
import { DisbursementTracking, DisbursementAttachment as DBAttachment } from '@/types/database';

interface DisbursementSidebarProps {
    currentStep?: number;
    tracking?: DisbursementTracking[];
    attachments?: DBAttachment[];
}

export function DisbursementSidebar({ currentStep, tracking, attachments = [] }: DisbursementSidebarProps) {
    return (
        <div className="flex flex-col gap-6">
            <DisbursementStatusTracking currentStep={currentStep} tracking={tracking} />
            <DisbursementAttachment attachments={attachments} mode="view" />
        </div>
    );
}
