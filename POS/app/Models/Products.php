<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table= 'products';
    protected $fillable= ['product_name', 'description', 'brand', 'price', 'quantity', 'alert_stock'];
}
