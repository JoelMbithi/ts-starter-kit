<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Order_Details;
use Illuminate\Http\Request;

class OrderDetailsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'unitprice' => 'required|numeric|min:0',
        ]);

        $amount = $request->quantity * $request->unitprice;

        $detail = Order_Details::create([
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'unitprice' => $request->unitprice,
            'amount' => $amount,
            'discount' => $request->discount ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'detail' => $detail,
        ]);
    }
}
