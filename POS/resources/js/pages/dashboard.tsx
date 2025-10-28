import SalesChart from '@/components/Dashboard/SalesChart';
import WelcomeBanner from '@/components/Dashboard/WelcomingBanner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/', 
    },
];

interface Order {
    id: number;
    name: string;
    address: string;
    created_at: string;
    total: number;
    payment_method: string;
    // Optional items array representing order line items
    items?: {
        product_name?: string;
        quantity?: number;
        price?: number;
        [key: string]: any;
    }[];
}

interface Product {
    id: number;
    product_name: string;
    quantity: number;
    alert_stock: number;
}

interface DashboardProps {
    orders?: Order[];
    total_revenue?: number;
    average_order_value?: number;
    today_orders_count?: number;
    total_orders_count?: number;
    low_stock_products?: Product[];
    [key: string]: any;
}

// POS Stat Card Component
const PosStatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon,
    loading = false
}: { 
    title: string; 
    value: string; 
    change?: string; 
    changeType?: 'positive' | 'negative';
    icon: string;
    loading?: boolean;
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                        {change && (
                            <span className={`text-xs font-medium ${
                                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {change}
                            </span>
                        )}
                    </>
                )}
            </div>
            <div className="text-2xl">{loading ? '⏳' : icon}</div>
        </div>
    </div>
);

// Recent Transactions Component
const RecentTransactions = ({ orders = [] }: { orders?: Order[] }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm h-full">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">View All</button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
            {!orders || orders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent transactions</p>
            ) : (
                orders.slice(0, 6).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                                transaction.payment_method === 'cash' ? 'bg-green-500' : 
                                transaction.payment_method === 'card' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">#{transaction.id}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Ksh {transaction.total}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

// Quick POS Actions
const QuickPosActions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'New Sale', icon: '💰', color: 'bg-green-500 hover:bg-green-600', href: '/orders' },
                { label: 'Inventory', icon: '🛍️', color: 'bg-blue-500 hover:bg-blue-600', href: '/products' },
                { label: 'Customers', icon: '👥', color: 'bg-purple-500 hover:bg-purple-600', href: '/customer' },
                { label: 'Reports', icon: '📊', color: 'bg-orange-500 hover:bg-orange-600', href: '/reports' },
            ].map((action, index) => (
                <a
                    key={index}
                    href={action.href}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-white ${action.color} transition-all duration-200 transform hover:scale-105`}
                >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                </a>
            ))}
        </div>
    </div>
);

// Low Stock Alert Component
const LowStockAlerts = ({ lowStockProducts = [] }: { lowStockProducts?: Product[] }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alert</h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {lowStockProducts.length} items
            </span>
        </div>
        <div className="space-y-3">
            {!lowStockProducts || lowStockProducts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-2">All products are well stocked</p>
            ) : (
                lowStockProducts.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                            <p className="text-xs text-red-600 dark:text-red-400">Only {item.quantity} left</p>
                        </div>
                        <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                            Reorder
                        </button>
                    </div>
                ))
            )}
        </div>
    </div>
);

// Top Selling Products
const TopSellingProducts = ({ orders = [] }: { orders?: Order[] }) => {
    // Count product sales from order items
    const productSales: Record<string, { quantity: number; revenue: number }> = {};
console.log('Orders for top selling products:', orders);

    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
                const name = item.product_name || 'Unknown Product';
                const quantity = Number(item.quantity) || 0;
                const revenue = (Number(item.price) || 0) * quantity;

                if (!productSales[name]) {
                    productSales[name] = { quantity: 0, revenue: 0 };
                }

                productSales[name].quantity += quantity;
                productSales[name].revenue += revenue;
            });
        }
    });

    // Convert to array and sort by total quantity sold
    const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({
            name,
            sales: data.quantity,
            revenue: `Ksh ${data.revenue.toLocaleString()}`
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4); // show top 4

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
            <div className="space-y-4">
                {topProducts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-2">No sales data available</p>
                ) : (
                    topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                                    <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">{index + 1}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} sold</p>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.revenue}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


export default function Dashboard() {
    const { props } = usePage<DashboardProps>();
    
    // Debug: log the props to see what's being passed
    console.log('Dashboard props:', props);
    
    // Safe destructuring with default values
    const { 
        orders = [], 
        total_revenue = 0, 
        average_order_value = 0, 
        today_orders_count = 0,
        total_orders_count = 0,
        low_stock_products = []
    } = props;

    // Debug: log individual values
    console.log('Total orders count from props:', total_orders_count);
    console.log('Orders array length:', orders.length);

    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        todayRevenue: 0,
        averageOrder: 0,
        todayOrders: 0,
        loading: false
    });

    // Initialize dashboard data
    useEffect(() => {
        console.log('Initializing dashboard data...');
        
        // Use total_orders_count if provided, otherwise fall back to orders.length
        const totalOrdersValue = total_orders_count > 0 ? total_orders_count : (orders?.length || 0);
        
        setDashboardData({
            totalOrders: totalOrdersValue,
            todayRevenue: total_revenue || 0,
            averageOrder: average_order_value || 0,
            todayOrders: today_orders_count || 0,
            loading: false
        });
        
        console.log('Set total orders to:', totalOrdersValue);
    }, [total_orders_count, orders, total_revenue, average_order_value, today_orders_count]);

    // Get recent orders (last 6) safely
    const recentOrders = orders && orders.length > 0 
        ? [...orders]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6)
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS Dashboard" />
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Main content area with scroll */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* POS Header Section */}
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-800">
                        <div className="p-6">
                            <WelcomeBanner />
                        </div>
                    </div>

                    {/* Debug info - remove in production */}
                   {/*  <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">
                        <p className="text-sm">
                            <strong>Debug Info:</strong> Total Orders Count: {dashboardData.totalOrders} | 
                            Orders Array Length: {orders?.length || 0} | 
                            Total Orders from Props: {total_orders_count}
                        </p>
                    </div> */}

                    {/* POS Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <PosStatCard 
                            title="Today's Revenue" 
                            value={`Ksh ${dashboardData.todayRevenue.toFixed(2)}`}
                            change="+12.5%" 
                            changeType="positive"
                            icon="💵"
                            loading={dashboardData.loading}
                        />
                        <PosStatCard 
                            title="Today's Orders" 
                            value={dashboardData.todayOrders.toString()}
                            change="+8.2%" 
                            changeType="positive"
                            icon="🛍️"
                            loading={dashboardData.loading}
                        />
                        <PosStatCard 
                            title="Total Orders" 
                            value={dashboardData.totalOrders.toString()}
                            change="+15.3%" 
                            changeType="positive"
                            icon="📊"
                            loading={dashboardData.loading}
                        />
                        <PosStatCard 
                            title="Average Order" 
                            value={`Ksh ${dashboardData.averageOrder.toFixed(2)}`}
                            change="-2.1%" 
                            changeType="negative"
                            icon="🛒"
                            loading={dashboardData.loading}
                        />
                    </div>

                    {/* Main POS Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Charts & Transactions */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Sales Chart */}
                          {/*   <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Sales Overview
                                    </h3>
                                    <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option>Today</option>
                                        <option>This Week</option>
                                        <option>This Month</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-center justify-center relative">
                                    <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                    <p className="text-gray-500 dark:text-gray-400 absolute">
                                        Sales chart visualization will appear here
                                    </p>
                                </div>
                            </div> */}

                            <SalesChart orders={orders} loading={dashboardData.loading}/>

                            {/* Recent Transactions */}
                            <RecentTransactions orders={recentOrders} />
                        </div>

                        {/* Right Column - Actions & Alerts */}
                        <div className="space-y-6">
                            <QuickPosActions />
                            <LowStockAlerts lowStockProducts={low_stock_products} />
                            <TopSellingProducts orders={orders}  />
                        </div>
                    </div>

                    {/* Bottom Section - Additional POS Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Peak Hour</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {orders && orders.length > 0 ? '2:00 PM' : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {orders && orders.length > 0 ? '98.5%' : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Products</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}