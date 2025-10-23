<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    { 
        $product = Products::paginate(); 
        return Inertia::render('products/index',['products' =>$product]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       try {
         if ($request->hasFile('image')) {
            // Store image in the 'public/products' directory
            $path = $request->file('image')->store('products', 'public');

            // Set image path (for frontend access)
            $imagePath = '/storage/' . $path; 
        } else {
            $imagePath = null;
        }
            

         $product = Products:: Create([
            'product_name' => $request->product_name,
            'description' => $request->description,
            'brand' => $request->brand,
            'price' => $request-> price,
            'quantity' => $request-> quantity,
            'alert_stock' => $request-> alert_stock,
            'image' =>$imagePath,
        ]);

        return response() -> json([
            'message' => 'Product created successfully!',
            'product' => $product
        ], 201);    
       } catch (\Throwable $e) {
         return response()->json([
            'message' => 'Failed to create product',
            'error' => $e->getMessage()
        ], 500);
       }
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Products $products)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $products)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Products:: find($id);

        if(!$product){
            return back()->with("Error","Product not found");
        }

        $product = $product->update( $request->all());
        return back()->with("success","Product updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Products::find($id);

        if(!$product){
            return back()->with("Error","Product not found");
        }
        $product = $product->delete();
        return back()->with("success","Product deleted successfully");
    }
}
