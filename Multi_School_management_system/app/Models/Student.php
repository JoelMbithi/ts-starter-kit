<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';
    public $timestamps = true; // set to false if you don't want created_at/updated_at

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'grade',
        'class',
        'age',
        'registration_number',
    ];
}
