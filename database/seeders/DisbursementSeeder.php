<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Disbursement;
use App\Models\DisbursementItem;
use App\Models\DisbursementTracking;
use App\Models\Account;
use App\Models\User;
use Carbon\Carbon;

class DisbursementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get accounts and users for foreign keys
        $cashAccount = Account::where('account_code', '1001')->first();
        $bankAccount = Account::where('account_code', '1002')->first();
        $rentExpense = Account::where('account_code', '5001')->first();
        $accountsPayable = Account::where('account_code', '2001')->first();

        $assistant = User::where('email', 'assistant@example.com')->first();
        $head = User::where('email', 'head@example.com')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        // Check if required data exists
        if (!$cashAccount || !$bankAccount || !$rentExpense || !$accountsPayable) {
            $this->command->warn('Required accounts not found. Please run ChartOfAccountsSeeder first.');
            return;
        }

        if (!$assistant || !$head || !$admin) {
            $this->command->warn('Required users not found. Please run DatabaseSeeder to create users first.');
            return;
        }

        // Disbursement 1 - Fully Approved
        $disbursement1 = Disbursement::create([
            'control_number' => 'DV-2026-001',
            'title' => 'Office Rent Payment - January 2026',
            'description' => 'Monthly office rent payment for the main office building',
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement1->id,
            'account_id' => $rentExpense->id,
            'amount' => 50000.00,
            'order_number' => 1,
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement1->id,
            'account_id' => $cashAccount->id,
            'amount' => 50000.00,
            'order_number' => 2,
        ]);

        // Tracking history - fully approved
        DisbursementTracking::create([
            'disbursement_id' => $disbursement1->id,
            'handled_by' => $assistant->id,
            'role' => 'accounting_assistant',
            'action' => 'approved',
            'remarks' => 'Verified supporting documents. All in order.',
            'acted_at' => Carbon::now()->subDays(5),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement1->id,
            'handled_by' => $head->id,
            'role' => 'head',
            'action' => 'approved',
            'remarks' => 'Approved for payment.',
            'acted_at' => Carbon::now()->subDays(4),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement1->id,
            'handled_by' => $admin->id,
            'role' => 'auditor',
            'action' => 'approved',
            'remarks' => 'Audit complete. No issues found.',
            'acted_at' => Carbon::now()->subDays(3),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement1->id,
            'handled_by' => $admin->id,
            'role' => 'svp',
            'action' => 'approved',
            'remarks' => 'Final approval granted.',
            'acted_at' => Carbon::now()->subDays(2),
        ]);

        // Disbursement 2 - Pending at Head level
        $disbursement2 = Disbursement::create([
            'control_number' => 'DV-2026-002',
            'title' => 'Supplier Payment - ABC Corp',
            'description' => 'Payment for office supplies and equipment',
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement2->id,
            'account_id' => $accountsPayable->id,
            'amount' => 25000.00,
            'order_number' => 1,
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement2->id,
            'account_id' => $bankAccount->id,
            'amount' => 25000.00,
            'order_number' => 2,
        ]);

        // Tracking - approved by assistant, pending at head
        DisbursementTracking::create([
            'disbursement_id' => $disbursement2->id,
            'handled_by' => $assistant->id,
            'role' => 'accounting_assistant',
            'action' => 'approved',
            'remarks' => 'Documents verified and complete.',
            'acted_at' => Carbon::now()->subDays(2),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement2->id,
            'handled_by' => null,
            'role' => 'head',
            'action' => 'pending',
            'remarks' => null,
            'acted_at' => null,
        ]);

        // Disbursement 3 - Just submitted, pending at assistant
        $disbursement3 = Disbursement::create([
            'control_number' => 'DV-2026-003',
            'title' => 'Utility Bills Payment',
            'description' => 'Electricity and water bills for January 2026',
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement3->id,
            'account_id' => $accountsPayable->id,
            'amount' => 15000.00,
            'order_number' => 1,
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement3->id,
            'account_id' => $cashAccount->id,
            'amount' => 15000.00,
            'order_number' => 2,
        ]);

        // Tracking - pending at assistant
        DisbursementTracking::create([
            'disbursement_id' => $disbursement3->id,
            'handled_by' => null,
            'role' => 'accounting_assistant',
            'action' => 'pending',
            'remarks' => null,
            'acted_at' => null,
        ]);

        // Disbursement 4 - Rejected at auditor level
        $disbursement4 = Disbursement::create([
            'control_number' => 'DV-2026-004',
            'title' => 'Equipment Purchase',
            'description' => 'New computer equipment for accounting department',
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement4->id,
            'account_id' => $accountsPayable->id,
            'amount' => 75000.00,
            'order_number' => 1,
        ]);

        DisbursementItem::create([
            'disbursement_id' => $disbursement4->id,
            'account_id' => $bankAccount->id,
            'amount' => 75000.00,
            'order_number' => 2,
        ]);

        // Tracking - rejected at auditor
        DisbursementTracking::create([
            'disbursement_id' => $disbursement4->id,
            'handled_by' => $assistant->id,
            'role' => 'accounting_assistant',
            'action' => 'approved',
            'remarks' => 'All documents attached.',
            'acted_at' => Carbon::now()->subDays(3),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement4->id,
            'handled_by' => $head->id,
            'role' => 'head',
            'action' => 'approved',
            'remarks' => 'Budget allocation confirmed.',
            'acted_at' => Carbon::now()->subDays(2),
        ]);

        DisbursementTracking::create([
            'disbursement_id' => $disbursement4->id,
            'handled_by' => $admin->id,
            'role' => 'auditor',
            'action' => 'rejected',
            'remarks' => 'Missing purchase order. Please resubmit with complete documentation.',
            'acted_at' => Carbon::now()->subDays(1),
        ]);
    }
}
