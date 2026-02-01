<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryUpload extends Model
{
    protected $fillable = ['folder', 'filename'];
}
