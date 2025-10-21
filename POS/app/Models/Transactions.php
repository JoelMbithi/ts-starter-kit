<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    protected $table= 'transactions';
    protected $fillable= ['order_id', 'paid-amount', 'balance', 'payment_method', 'transaction_amount', 'user_id','transaction_date'];
}
