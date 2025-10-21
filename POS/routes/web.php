<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\TransactionsController;

use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



Route::resource('/orders', OrderController::class);// orders.index
    Route::resource('/products', ProductsController::class);//products.index
    Route::resource('/suppliers', SuppliersController::class);//suppliers.index
    Route::resource('/users', UserController::class);//users.index
    Route::resource('/companies', CompaniesController::class);//companies.index
    Route::resource('/transactions', TransactionsController::class);//transactions.index



require __DIR__.'/settings.php';
