<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'degree',
        'experience',
        'speciality',
        'fees',
        'about',
        'image',
        'address',
        'availability',
        'slots_booked',
    ];
    public function doctor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    

}
