<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('disbursements', function (Blueprint $table) {
            $table->id();
            $table->string('control_number');
            $table->string('title');
            $table->string('description');
            $table->timestamps();
        });

        Schema::create('disbursement_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disbursement_id')->constrained('disbursements')->cascadeOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->integer('order_number');
            $table->timestamps();
        });

        Schema::create('disbursement_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disbursement_id')->constrained('disbursements')->cascadeOnDelete();
            $table->foreignId('handled_by')->nullable()->constrained('users')->cascadeOnDelete();
            $table->enum('role', ['accounting_assistant', 'head', 'auditor', 'svp']);
            $table->enum('action', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamp('acted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('disbursement_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disbursement_id')->constrained('disbursements')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disbursement_attachments');
        Schema::dropIfExists('disbursement_tracking');
        Schema::dropIfExists('disbursement_items');
        Schema::dropIfExists('disbursements');
    }
};
