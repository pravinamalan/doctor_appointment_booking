<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'password_text',
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
    public function appointments()
    {
        return $this->hasMany(Appointment::class,'doc_id');
    }
}
