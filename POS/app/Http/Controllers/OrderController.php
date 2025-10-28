<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Order_Details;
use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::paginate();
        $orders = Order::all()->map(function ($order) {
            return [
                'id' => $order->id,
                'name' => $order->name,
                'address' => $order->address,
                'product_name' => $order->orderDetails->first()->product_name ?? 'N/A',
                 'payment_method' => $order->payment_method,
                'created_at' => $order->created_at,
                'total' => $order->total,
            ];
        });

        return Inertia::render('orders/index', [
            'products' => $products,
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Products::all();
        return Inertia::render('orders/create', ['products' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * 
     */
      public function store(Request $request)
    {
        //  Validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'cart' => 'required|array',
            'payment_method' => 'required|in:cash,bank,card',
            'cart.*.product.id' => 'required|exists:products,id',
            'cart.*.product_name' => 'required|string',
            'cart.*.price' => 'required|numeric',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        //  Calculate total
        $total = collect($validated['cart'])->sum(function ($item) {
            return $item['price'] * $item['quantity'];
        });

        // Create the main order
        $order = Order::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'payment_method' => $validated['payment_method'],
            'total' => $total,
        ]);

        //  Save order details (with product name)
        foreach ($validated['cart'] as $item) {
            Order_Details::create([
                'order_id' => $order->id,
                'product_id' => $item['product']['id'], 
                'product_name' => $item['product_name'],
                'quantity' => $item['quantity'],
                'unitprice' => $item['price'],
                'amount' => $item['price'] * $item['quantity'],
                'discount' => 0,
            ]);
        }

        return back()->with("success", "Order created successfully!");
    }
    /* public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'cart' => 'required|array',
            'payment_method' => 'required|in:cash,bank,card', 
            'cart.*.product.id' => 'required|exists:products,id',
             'cart.*.product_name' => 'required|string',
             'cart.*.price' => 'required|numeric',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        // Calculate total from cart
        $total = collect($validated['cart'])->sum(function ($item) {
            $product = Products::find($item['product']['id']);
            return $product->price * $item['quantity'];
        });

        // Create the Order
        $order = Order::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
             'payment_method' => $validated['payment_method'],
            'total' => $total,
        ]);

       return back()->with("success", "Order created successfully!");
    } */

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}