<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'doc_id',
        'amount',
        'slot_date',
        'slot_time',
        'is_completed',
        'payment',
        'cancelled',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doc_id');
    }
    

}
