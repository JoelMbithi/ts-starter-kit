import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

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

interface Order {
    id: number;
    name: string;
    address: string;
    created_at: string;
    total: number;
}

interface Props extends Record<string, any> {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
    };
    orders: Order[];
}

export default function Order() {
    const { products, orders } = usePage<Props>().props;
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        address: '',
    });

    // Cart state
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
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

        setLoading(true);
        try {
            await router.post('/orders', {
                name: form.name,
                address: form.address,
                cart: cart.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity,
                })),
            }, {
                onSuccess: () => {
                    console.log( )
                    setCart([]); // Reset cart
                    setForm({ name: '', address: '' }); // Reset form
                    router.reload({ only: ['orders'] }); // Refresh orders
                },
                onError: (errors) => {
                    alert('Failed to create order: ' + Object.values(errors).join(', '));
                },
            });
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.data.filter(product =>
        product.product_name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
            

                {/* Top Row: Products & Cart */}
                <div className="flex flex-row w-full gap-4">
                    {/* Left Panel: Completed Orders */}
                    <div className="w-4/5  border h-120 rounded p-4 overflow-y-auto">
                     <div className='flex flex-row justify-between'>
                        <h2 className="text-xl font-bold mb-2">Products</h2>
                    {/* Search Bar */}
                    <div className="relative flex items-center justify-center w-full sm:w-1/3 mb-6">
                        <div className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <Search className="ml-3 text-slate-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="border-none focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-slate-400 px-3 py-2 w-full"
                            />
                        </div>
                    </div>
                     </div>

                    {filteredProducts.length === 0 ? (
                        <p>No products available</p>
                    ) : (
                       <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-4">
    {filteredProducts.map(product => {
        const [quantity, setQuantity] = useState(1);

        return (
            <div key={product.id} className="border h-70  rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col justify-between">
                {/* Product Image */}
                <div className="w-full h-32  bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
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

                {/* Product Info */}
                <div className="flex flex-col gap-1 mb-2">
                    <h3 className="font-semibold text-base">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-sm text-gray-500">Available: {product.quantity}</p>
                    {product.alert_stock && product.quantity <= product.alert_stock && (
                        <p className="text-xs text-red-500">Low stock!</p>
                    )}
                    <p className="font-bold text-green-600 text-sm">ksh {product.price}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                    >
                        -
                    </button>
                    <span className="text-sm font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                    >
                        +
                    </button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={() => addToCart(product, quantity)}
                    className="bg-teal-600 text-white rounded py-1 text-sm hover:bg-teal-700 transition"
                >
                    Add to Cart
                </button>
            </div>
        );
    })}
</div>

                    )}
                        
                    </div>

                    {/* Right Panel: Cart */}
                    <div className="w-2/5 border h-120 rounded p-4 overflow-y-auto">
                        {/* Customer Information */}
                <div className="border rounded p-4">
                    <h2 className="text-lg font-bold mb-2">Customer Details</h2>
                    <div className="flex flex-row gap-4">
                        <Input
                            type="text"
                            placeholder="Customer Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Address"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            required
                        />
                    </div>
                </div>
                        <h2 className="text-lg font-bold mb-2">Cart</h2>
                        <div className="space-y-2">
                            {cart.length === 0 ? (
                                <p>No items in cart.</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product.id} className="border p-2 rounded flex justify-between items-center">
                                        <div>
                                            <p>{item.product.product_name}</p>
                                            <p>ksh {item.product.price} x {item.quantity}</p>
                                        </div>
                                        <button
                                            className="text-red-500"
                                            onClick={() => removeFromCart(item.product.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                            
                        </div>
                        <div className="mt-4 font-bold text-right">
                            Total: ksh {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
                        </div>
                        <button
                            className="bg-green-600 text-white p-2 mt-2 w-full rounded"
                            onClick={createOrder}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Complete Order'}
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Products */}
                <div className="border rounded p-4 overflow-y-auto">
                   <h2 className="text-lg font-bold mb-2">Completed Orders</h2>
                        <div className="space-y-2 h-50">
                            {orders && orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order.id} className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-all duration-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Order #{order.id}
                                    </h3>
                                    <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="flex fle-row justify-betwe gap-10 space-y- mb-">
                                    <p className="flex flex-col text-gray-700"><strong>Customer:</strong> {order.name}</p>
                                    <p className="flex flex-col text-gray-600"><strong>Address:</strong> {order.address}</p>
                                  {/*    <p className="text-gray-600"><strong>Address:</strong> {order.product_name}</p> */}
                                    <p className="flex flex-col text-lg font-bold text-green-600"><strong>Total:</strong> ksh {order.total}</p>
                                </div>
                                
                               
                                </div>
                                                                ))
                            ) : (
                                <p>No orders available.</p>
                            )}
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}