<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $fillable = ['name', 'address','total', 'payment_method',];

    public function orderDetails()
    {
        return $this->hasMany(Order_Details::class, 'order_id');
    }
}