<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;

    public $timesramps = false;

    protected $primaryKey = 'teacher_id';

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'subject',
    ];
}
