<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia; // <-- import Inertia here

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('Product/Index',compact('products'));
    }
    public function create(){
        return Inertia::render('Product/Create');
    }
    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description'=>'nullable|string',
        ]);

          Product::create($request->all());
          return redirect()->route('product.index');
    }

    public function destroy(Product $product){
        $product->delete();
        return redirect()-> route('product.index')->with('message',"Product deleted successfully");

    }

    public function edit(Product $product){
        return Inertia::render('Product/Edit',compact('product'));
    }
    public function update (Request $request,Product $product){
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description'=>'nullable|string',
        ]);
        
        $product->update([
            'name'=>$request->input('name'),
            'price'=>$request->input('price'),
            'description'=>$request->input('description'),
        ]);
        return redirect()->route('product.index');
    }
}
