import { Disbursement } from '@/types/database';

interface VoucherTemplateProps {
    disbursement: Disbursement;
}

export function VoucherTemplate({ disbursement }: VoucherTemplateProps) {
    const debitItems = disbursement.items?.filter(item => item.type === 'debit') || [];
    const creditItems = disbursement.items?.filter(item => item.type === 'credit') || [];

    const totalDebit = debitItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalCredit = creditItems.reduce((sum, item) => sum + Number(item.amount), 0);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Ensure we have at least 11 rows for the table
    const allItems = disbursement.items || [];
    const emptyRowsNeeded = Math.max(0, 11 - allItems.length);

    return (
        <div id="voucher-paper" className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl" style={{ fontFamily: 'Times New Roman, serif' }}>
            <div className="px-[1.5cm] sm:px-[2.5cm] py-[1cm] pb-[2.5cm] min-h-[297mm] flex flex-col">
                {/* Header */}
                <div className="text-center mb-6">
                    <img src="/Sacli/Format_3.jpg" alt="ST. ANNE COLLEGE LUCENA, INC." className="w-full max-w-[500px] mx-auto mb-4" />
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.05em', marginTop: '16px' }}>CHECK VOUCHER</h2>
                </div>

                {/* Top Right Info - NO and DATE */}
                <div className="flex justify-end mb-4 text-xs md:text-sm" style={{ gap: '40px' }}>
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                            <span className="font-bold" style={{ marginRight: '20px', minWidth: '50px' }}>NO.</span>
                            <span style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '4px' }}>
                                {disbursement.control_number?.split('-').pop()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <span className="font-bold" style={{ marginRight: '20px', minWidth: '50px' }}>DATE</span>
                            <span style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '4px' }}>
                                {formatDate(disbursement.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Table - Extended to fill page */}
                <div className="flex-grow flex flex-col mb-6">
                    <table className="w-full border-collapse flex-grow" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th className="p-2 md:p-3 text-center text-xs md:text-sm font-bold w-24" style={{ borderLeft: '2px solid black', borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                                    ACCOUNT NO.
                                </th>
                                <th className="p-2 md:p-3 text-center text-xs md:text-sm font-bold flex-1" style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                                    PARTICULARS
                                </th>
                                <th className="p-2 md:p-3 text-center text-xs md:text-sm font-bold w-20" style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                                    REF.
                                </th>
                                <th className="p-2 md:p-3 text-center text-xs md:text-sm font-bold w-28" style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                                    DEBIT
                                </th>
                                <th className="p-2 md:p-3 text-center text-xs md:text-sm font-bold w-28" style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                                    CREDIT
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Actual data rows */}
                            {allItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderLeft: '2px solid black', borderRight: '2px solid black', height: '32px' }}>
                                        {item.account?.account_code}
                                    </td>
                                    <td className={`p-2 md:p-3 text-xs md:text-sm ${item.type === 'credit' ? 'pl-8' : ''}`} style={{ borderRight: '2px solid black', height: '32px' }}>
                                        {item.account?.account_name}
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        {item.type === 'debit' ? Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        {item.type === 'credit' ? Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                    </td>
                                </tr>
                            ))}

                            {/* Empty rows to fill remaining space */}
                            {Array.from({ length: emptyRowsNeeded }).map((_, index) => (
                                <tr key={`empty-${index}`}>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderLeft: '2px solid black', borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-center" style={{ borderRight: '2px solid black', height: '32px' }}>
                                        &nbsp;
                                    </td>
                                </tr>
                            ))}

                            {/* Total Row */}
                            <tr style={{ fontWeight: 'bold' }}>
                                <td style={{ borderLeft: '2px solid black', borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', height: '40px', padding: '4px 8px', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                    TOTAL
                                </td>
                                <td style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', height: '40px', padding: '4px 8px', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                    &nbsp;
                                </td>
                                <td style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', height: '40px', padding: '4px 8px', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                    &nbsp;
                                </td>
                                <td style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', textDecoration: 'underline', height: '40px', padding: '4px 8px', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                    {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ borderRight: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', textDecoration: 'underline', height: '40px', padding: '4px 8px', fontSize: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                    {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Signature Lines */}
                <div className="mt-auto" style={{ fontSize: '11px', marginTop: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>PREPARED BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>APPROVED BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>CHECKED BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>PAID BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>RECOMMENDED BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1f2937', minWidth: '140px' }}>RECEIVED BY</p>
                            <div style={{ borderBottom: '1px solid black', flex: 1, height: '20px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
