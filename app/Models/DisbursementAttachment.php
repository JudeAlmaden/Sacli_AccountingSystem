<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisbursementAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'disbursement_id',
        'file_path',
        'file_name',
        'file_type',
    ];

    /**
     * Get the disbursement that owns this attachment.
     */
    public function disbursement(): BelongsTo
    {
        return $this->belongsTo(Disbursement::class);
    }
}
