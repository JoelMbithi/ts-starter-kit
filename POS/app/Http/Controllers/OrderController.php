<?php

namespace App\Http\Controllers;

use App\Models\Order;
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
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'cart' => 'required|array',
            'cart.*.product.id' => 'required|exists:products,id',
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
            'total' => $total,
        ]);

       return back()->with("success", "Order created successfully!");
    }

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