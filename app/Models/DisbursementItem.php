<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisbursementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'disbursement_id',
        'account_id',
        'amount',
        'order_number',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get the disbursement that owns this item.
     */
    public function disbursement(): BelongsTo
    {
        return $this->belongsTo(Disbursement::class);
    }

    /**
     * Get the account associated with this item.
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
