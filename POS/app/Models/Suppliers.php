<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    protected $table= 'suppliers';
    protected $fillable= ['supplier_name', 'address', 'phone', 'email'];
}
