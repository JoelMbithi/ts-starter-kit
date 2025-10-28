import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Search, CreditCard, Landmark, Wallet, Download, Printer, ArrowUpDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Order', href: '/orders' },
];

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  alert_stock: number;
  image?: string;
}

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
  product_name:string;
  items?: OrderItem[];
}

interface Props extends Record<string, any> {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
  };
  orders: Order[];
}

type PaymentMethod = 'cash' | 'bank' | 'card' | '';
type SortKey = 'created_at' | 'total';
type SortOrder = 'asc' | 'desc';

export default function Order() {
  const { products, orders } = usePage<Props>().props;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showModal, setShowModal] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    console.log("Adding to cart:", { product, quantity });
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const createOrder = async () => {
    if (!form.name || !form.address) {
      alert('Please enter customer name and address.');
      return;
    }

    if (cart.length === 0) {
      alert('Please add at least one product to the cart.');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    setLoading(true);
    try {
      await router.post(
        '/orders',
        {
          name: form.name,
          address: form.address,
          payment_method: paymentMethod,
          cart: cart.map((item) => ({
            product: { id: item.product.id 
            },
   
  product_name: item.product.product_name,
  quantity: item.quantity,
  price: item.product.price,
           
          })),
        },
        {
          onSuccess: () => {
            setCart([]);
            setForm({ name: '', address: '' });
            setPaymentMethod('');
            router.reload({ only: ['orders'] });
          },
          onError: (errors) => {
            alert('Failed to create order: ' + Object.values(errors).join(', '));
          },
        }
      );
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    try {
      const response = await fetch(`/orders/${orderId}/items`);
      const data = await response.json();
      console.log(data.items)
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

  const filteredProducts = products.data.filter(
    (product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())
  );

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

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Order" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Button to Open Modal */}
        <button
          className="text-lg border p-2 rounded-md shadow-md bg-black text-white hover:bg-gray-800 font-bold mb-4 w-fit"
          onClick={() => setShowModal(true)}
          aria-label="View Completed Orders"
        >
          View Completed Orders
        </button>

        {/* Custom Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Completed Orders</h2>
                  <p className="text-gray-500">View, print, or generate reports for all completed orders</p>
                </div>
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
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
              <div className="space-y-3 overflow-y-auto h-[calc(100vh-180px)]">
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
                          <p className="text-gray-700 font-medium">Product:</p>
                          <p className="text-gray-600">{order.product_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Total:</p>
                          <p className="text-lg font-bold text-green-600">ksh {order.total}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-row w-full gap-4">
          {/* Left Panel: Products */}
          <div className="w-4/5 border h-120 rounded p-4 overflow-y-auto">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-bold mb-2">Products</h2>
              <div className="relative flex items-center justify-center w-full sm:w-1/3 mb-6">
                <div className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Search className="ml-3 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-slate-400 px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No products available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const [quantity, setQuantity] = useState(1);
                  return (
                    <div
                      key={product.id}
                      className="border rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col justify-between"
                    >
                      <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={`http://localhost:8000${product.image}`}
                            alt={product.product_name}
                            className="max-w-full max-h-full object-contain rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No Image</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 mb-2">
                        <h3 className="font-semibold text-base">{product.product_name}</h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <p className="text-sm text-gray-500">Available: {product.quantity}</p>
                        {product.alert_stock && product.quantity <= product.alert_stock && (
                          <p className="text-xs text-red-500">Low stock!</p>
                        )}
                        <p className="font-bold text-green-600 text-sm">ksh {product.price}</p>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => addToCart(product, quantity)}
                        className="bg-teal-600 text-white rounded py-1 text-sm hover:bg-teal-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Cart & Checkout */}
          <div className="w-2/5 border h-120 rounded p-4 overflow-y-auto">
            <div className="border rounded p-4 mb-4">
              <h2 className="text-lg font-bold mb-3">Customer Details</h2>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Customer Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
            </div>
            <div className="border rounded p-4 mb-4">
              <h2 className="text-lg font-bold mb-3">Payment Method</h2>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  aria-label="Select Cash Payment"
                >
                  <Wallet className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  aria-label="Select Bank Payment"
                >
                  <Landmark className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium">Bank</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  aria-label="Select Card Payment"
                >
                  <CreditCard className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium">Card</span>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3">Cart Items</h2>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items in cart.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="border p-3 rounded flex justify-between items-center bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product.product_name}</p>
                        <p className="text-sm text-gray-600">
                          ksh {item.product.price} × {item.quantity} = ksh {item.product.price * item.quantity}
                        </p>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Remove ${item.product.product_name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">ksh {totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">ksh 0</span>
              </div>
              <div className="flex justify-between items-center mb-4 border-t pt-2">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-green-600">ksh {totalAmount}</span>
              </div>
              <button
                className={`w-full p-3 rounded-lg font-semibold transition-colors ${
                  loading || !paymentMethod || cart.length === 0 || !form.name || !form.address
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={createOrder}
                disabled={loading || !paymentMethod || cart.length === 0 || !form.name || !form.address}
                aria-label="Complete Order"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Complete Order - ksh ${totalAmount}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}