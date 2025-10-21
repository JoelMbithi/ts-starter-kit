<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Companies extends Model
{
    protected $table= 'companies';
    protected $fillable= ['company_name', 'company_email', 'company_phone', 'company_address', 'company_fax'];
}
