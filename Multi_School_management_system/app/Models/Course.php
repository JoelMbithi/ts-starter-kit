<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $primaryKey = 'course_id'; //  Tell Laravel your PK
    public $incrementing = true;         //  If it's auto-increment
    protected $keyType = 'int';          //  If it's integer

    protected $fillable = [
        'tenant_id',
        'course_name',
        'teacher',
        'code',
        'description',
        'teacher',
        'duration',
    ];

    public function enrollments()
    {
        //  Match your enrollment foreign key to the course primary key
        return $this->hasMany(Enrollment::class, 'course_id', 'course_id');
    }
}
