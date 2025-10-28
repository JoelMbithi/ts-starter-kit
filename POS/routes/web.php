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
    use App\Models\Order;

    use App\Models\Products;
    use Illuminate\Support\Facades\DB;

    Route::get('/', function () {
        try {
            // Get today's date
            $today = now()->format('Y-m-d');
            
            // Get orders for today
            $todayOrders = Order::whereDate('created_at', $today)->get();
            
            // Get all orders for recent transactions (last 50)
            $allOrders = Order::with('items')->latest()->take(50)->get();
            
            // Calculate metrics
            $todayRevenue = $todayOrders->sum('total') ?? 0;
            $todayOrdersCount = $todayOrders->count() ?? 0;
            $totalOrders = Order::count() ?? 0;
            
            // Calculate average order value
            $averageOrderValue = $totalOrders > 0 ? Order::avg('total') : 0;
            
            // Get low stock products - Use the correct model name
            // If your model is called 'Product', use that. If it's 'Products', use that.
            $lowStockProducts = Products::where('quantity', '<=', DB::raw('alert_stock'))
                ->orWhere('quantity', '<=', 5)
                ->get();

            return Inertia::render('welcome', [
                'orders' => $allOrders->toArray(),
                'total_revenue' => $todayRevenue,
                'average_order_value' => round($averageOrderValue, 2),
                'today_orders_count' => $todayOrdersCount,
                'total_orders_count' => $totalOrders,
                'low_stock_products' => $lowStockProducts->toArray(),
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Dashboard error: ' . $e->getMessage());
            
            // Return safe default values if there's any error
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

    Route::middleware(['auth', 'verified'])->group(function () {
    /*  Route::get('/dashboard', function () {
        $today = now()->format('Y-m-d');

        $todayOrders = \App\Models\Order::whereDate('created_at', $today)->get();
        $allOrders = \App\Models\Order::latest()->take(50)->get();

        $todayRevenue = $todayOrders->sum('total') ?? 0;
        $todayOrdersCount = $todayOrders->count() ?? 0;
        $totalOrders = \App\Models\Order::count() ?? 0;
        $averageOrderValue = $totalOrders > 0 ? \App\Models\Order::avg('total') : 0;

        $lowStockProducts = \App\Models\Products::where('quantity', '<=', \DB::raw('alert_stock'))
            ->orWhere('quantity', '<=', 5)
            ->get();

        return Inertia::render('dashboard', [
            'orders' => $allOrders->toArray(),
            'total_revenue' => $todayRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'today_orders_count' => $todayOrdersCount,
            'total_orders_count' => $totalOrders,
            'low_stock_products' => $lowStockProducts->toArray(),
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard'); */
    Route::get('/dashboard', function () {
        $today = now()->format('Y-m-d');

        $todayOrders = Order::whereDate('created_at', $today)->get();
        $allOrders = Order::latest()->take(50)->get();

        $todayRevenue = $todayOrders->sum('total') ?? 0;
        $todayOrdersCount = $todayOrders->count() ?? 0;
        $totalOrders = Order::count() ?? 0;
        $averageOrderValue = $totalOrders > 0 ? Order::avg('total') : 0;

        $lowStockProducts = Products::where('quantity', '<=', DB::raw('alert_stock'))
            ->orWhere('quantity', '<=', 5)
            ->get();

        // Add top-selling products
        $topSellingProductsRaw = DB::table('order_details')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $topSellingProducts = Products::whereIn(
            'id',
            $topSellingProductsRaw->pluck('product_id')
        )->get()->map(function($product) use ($topSellingProductsRaw) {
            $product->total_sold = $topSellingProductsRaw
                ->firstWhere('product_id', $product->id)->total_sold ?? 0;
            return $product;
        });

        return Inertia::render('dashboard', [
            'orders' => $allOrders->toArray(),
            'total_revenue' => $todayRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'today_orders_count' => $todayOrdersCount,
            'total_orders_count' => $totalOrders,
            'low_stock_products' => $lowStockProducts->toArray(),
            'top_selling_products' => $topSellingProducts->toArray(),
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');


    });


    Route::resource('/orders', OrderController::class);
    Route::resource('/products', ProductsController::class);
    Route::resource('/suppliers', SuppliersController::class);
    Route::resource('/users', UserController::class);
    Route::resource('/companies', CompaniesController::class);
    Route::resource('/transactions', TransactionsController::class);

    require __DIR__.'/settings.php';