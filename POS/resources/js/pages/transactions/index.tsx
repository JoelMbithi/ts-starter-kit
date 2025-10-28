import WelcomeBanner from '@/components/Dashboard/WelcomingBanner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Search, Download, Printer, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

interface OrderItem {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    name: string;
    address: string;
    created_at: string;
    total: number;
    payment_method: string;
    items?: OrderItem[];
}

interface Props extends Record<string, any> {
    orders: Order[];
}

type SortKey = 'created_at' | 'total';
type SortOrder = 'asc' | 'desc';

export default function Transactions() {
    const { orders } = usePage<Props>().props;
    const [orderSearch, setOrderSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const fetchOrderItems = async (orderId: number) => {
        try {
            const response = await fetch(`/orders/${orderId}/items`);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching order items:', error);
            return [];
        }
    };

    const handlePrintOrder = async (order: Order) => {
        const items = await fetchOrderItems(order.id);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Order #${order.id}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            .header { margin-bottom: 20px; }
                            .total { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <h1>Order #${order.id}</h1>
                        <div class="header">
                            <p><strong>Customer:</strong> ${order.name}</p>
                            <p><strong>Address:</strong> ${order.address}</p>
                            <p><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
                            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <table>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            ${items
                                .map(
                                    (item: OrderItem) => `
                                <tr>
                                    <td>${item.product_name}</td>
                                    <td>${item.quantity}</td>
                                    <td>ksh ${item.price}</td>
                                    <td>ksh ${item.price * item.quantity}</td>
                                </tr>
                            `
                                )
                                .join('')}
                            <tr class="total">
                                <td colspan="3">Total</td>
                                <td>ksh ${order.total}</td>
                            </tr>
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handlePrintAllOrders = async () => {
        const allOrdersWithItems = await Promise.all(
            orders.map(async (order) => ({
                ...order,
                items: await fetchOrderItems(order.id),
            }))
        );
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>All Orders</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { text-align: center; }
                            .order { margin-bottom: 30px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            .header { margin-bottom: 10px; }
                            .total { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <h1>All Orders</h1>
                        ${allOrdersWithItems
                            .map(
                                (order) => `
                            <div class="order">
                                <div class="header">
                                    <h2>Order #${order.id}</h2>
                                    <p><strong>Customer:</strong> ${order.name}</p>
                                    <p><strong>Address:</strong> ${order.address}</p>
                                    <p><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
                                    <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <table>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                    ${order.items
                                        .map(
                                            (item: OrderItem) => `
                                        <tr>
                                            <td>${item.product_name}</td>
                                            <td>${item.quantity}</td>
                                            <td>ksh ${item.price}</td>
                                            <td>ksh ${item.price * item.quantity}</td>
                                        </tr>
                                    `
                                        )
                                        .join('')}
                                    <tr class="total">
                                        <td colspan="3">Total</td>
                                        <td>ksh ${order.total}</td>
                                    </tr>
                                </table>
                            </div>
                        `
                            )
                            .join('')}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleDownloadReport = () => {
        const headers = ['Order ID', 'Customer', 'Address', 'Payment Method', 'Total', 'Date'];
        const rows = orders.map((order) => [
            order.id,
            order.name,
            order.address,
            order.payment_method.toUpperCase(),
            `ksh ${order.total}`,
            new Date(order.created_at).toLocaleDateString(),
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const filteredOrders = orders
        .filter(
            (order) =>
                order.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                order.id.toString().includes(orderSearch)
        )
        .sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            if (sortKey === 'created_at') {
                return multiplier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            }
            return multiplier * (a.total - b.total);
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
              {/*   <WelcomeBanner />
                <div className="flex flex-row w-full gap-4">
                    <div className="relative aspect-video w-3/5 overflow-hidden rounded border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-4 ring-1 ring-slate-400" style={{ backgroundColor: '#008B8B' }}>
                            <h2 className="text-xl font-bold text-white">Transaction Summary</h2>
                            <p className="text-white">Total Orders: {orders.length}</p>
                            <p className="text-white">
                                Total Amount: ksh {orders.reduce((sum, order) => sum + order.total, 0)}
                            </p>
                        </div>
                    </div>
                   
                </div> */}
                <div className="relative h-120 flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">All Transactions</h2>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center w-full sm:w-1/3">
                                <Input
                                    type="text"
                                    placeholder="Search orders by customer or ID..."
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                    className="border rounded-lg px-3 py-2 w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="border rounded-lg px-2 py-1"
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                                >
                                    <option value="created_at">Sort by Date</option>
                                    <option value="total">Sort by Total</option>
                                </select>
                                <button
                                    className="p-2 border rounded-lg hover:bg-gray-100"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    aria-label="Toggle sort order"
                                >
                                    <ArrowUpDown className="w-5 h-5" />
                                </button>
                                <button
                                    className="flex items-center gap-2 p-2 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleDownloadReport}
                                    aria-label="Download orders report"
                                >
                                    <Download className="w-5 h-5" />
                                    Report
                                </button>
                                <button
                                    className="flex items-center gap-2 p-2 border rounded-lg bg-green-600 text-white hover:bg-green-700"
                                    onClick={handlePrintAllOrders}
                                    aria-label="Print all orders"
                                >
                                    <Printer className="w-5 h-5" />
                                    Print All
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3 h-100 overflow-y-auto">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    Order #{order.id}
                                                </h3>
                                                <span
                                                    className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                                        order.payment_method === 'cash'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.payment_method === 'bank'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}
                                                >
                                                    {order.payment_method.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    className="p-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                                                    onClick={() => handlePrintOrder(order)}
                                                    aria-label={`Print order ${order.id}`}
                                                >
                                                    <Printer className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-700 font-medium">Customer:</p>
                                                <p className="text-gray-600">{order.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-medium">Address:</p>
                                                <p className="text-gray-600">{order.address}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-medium">Total:</p>
                                                <p className="text-lg font-bold text-green-600">ksh {order.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No transactions found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}