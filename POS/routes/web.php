<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\TransactionsController;

use Inertia\Inertia;
use App\Models\Order;
use App\Models\Products;
use Illuminate\Support\Facades\DB;

// Public home (optional)
Route::get('/', function () {
    try {
        $today = now()->format('Y-m-d');
        $todayOrders = Order::whereDate('created_at', $today)->get();
        $allOrders = Order::with('orderDetails')->latest()->take(50)->get();

        $todayRevenue = $todayOrders->sum('total') ?? 0;
        $todayOrdersCount = $todayOrders->count() ?? 0;
        $totalOrders = Order::count() ?? 0;
        $averageOrderValue = $totalOrders > 0 ? Order::avg('total') : 0;

        $lowStockProducts = Products::where('quantity', '<=', DB::raw('alert_stock'))
            ->orWhere('quantity', '<=', 5)
            ->get();

        return Inertia::render('welcome', [ // Must match: resources/js/Pages/Welcome.tsx
            'orders' => $allOrders->toArray(),
            'total_revenue' => $todayRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'today_orders_count' => $todayOrdersCount,
            'total_orders_count' => $totalOrders,
            'low_stock_products' => $lowStockProducts->toArray(),
        ]);
    } catch (\Exception $e) {
        \Log::error('Home error: ' . $e->getMessage());
        return Inertia::render('welcome', [
            'orders' => [],
            'total_revenue' => 0,
            'average_order_value' => 0,
            'today_orders_count' => 0,
            'total_orders_count' => 0,
            'low_stock_products' => [],
        ]);
    }
})->name('home');

// PROTECTED ROUTES
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $today = now()->format('Y-m-d');

        // TODAY'S STATS
        $todayOrders = Order::whereDate('created_at', $today)->get();
        $todayRevenue = $todayOrders->sum('total') ?? 0;
        $todayOrdersCount = $todayOrders->count() ?? 0;
        $totalOrders = Order::count() ?? 0;
        $averageOrderValue = $totalOrders > 0 ? Order::avg('total') : 0;

        // RECENT ORDERS + LINE ITEMS
        $allOrders = Order::with('orderDetails')->latest()->take(50)->get();

        // LOW STOCK
        $lowStockProducts = Products::where('quantity', '<=', DB::raw('alert_stock'))
            ->orWhere('quantity', '<=', 5)
            ->get();

        // TOP-SELLING PRODUCTS (from order_details)
        $topSellingRaw = DB::table('order_details')
            ->select(
                'product_id',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(amount) as total_revenue')
            )
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $topSellingProducts = Products::whereIn('id', $topSellingRaw->pluck('product_id'))
            ->get()
            ->map(function ($product) use ($topSellingRaw) {
                $data = $topSellingRaw->firstWhere('product_id', $product->id);
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'total_sold' => $data->total_sold ?? 0,
                    'total_revenue' => $data->total_revenue ?? 0,
                ];
            });

        return Inertia::render('dashboard', [ // Must match: resources/js/Pages/Dashboard.tsx
            'orders' => $allOrders->toArray(),
            'total_revenue' => $todayRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'today_orders_count' => $todayOrdersCount,
            'total_orders_count' => $totalOrders,
            'low_stock_products' => $lowStockProducts->toArray(),
            'top_selling_products' => $topSellingProducts->toArray(),
        ]);
    })->name('dashboard');
});

// RESOURCE ROUTES
Route::resource('/orders', OrderController::class);
Route::resource('/products', ProductsController::class);
Route::resource('/suppliers', SuppliersController::class);
Route::resource('/users', UserController::class);
Route::resource('/companies', CompaniesController::class);
Route::resource('/transactions', TransactionsController::class);

require __DIR__.'/settings.php';