<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
  Route::get('/products', [ProductController:: class, 'index']) -> name('product.index');
  Route::get('/products/create',[ProductController::class,'create'])-> name('product.create');
  Route::post('/products', [ProductController:: class,'store'])->name('products.store');
  Route::get('/products/{product}/Edit', [ProductController:: class,'edit'])->name('product.edit');
    Route::put('/products/{product}', [ProductController:: class,'update'])->name('products.update');
  Route::delete('/products/{product}',[ProductController:: class,'destroy'])-> name('product.destroy');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';    
