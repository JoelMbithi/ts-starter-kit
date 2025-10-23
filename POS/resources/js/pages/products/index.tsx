import AddProducts from '@/components/Dashboard/AddProducts';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  brand:string;
  alert_stock:number;
  image?: string;
}
interface props {
  product: Product[];
}
interface PageProps {
  [key: string]: any;
}

interface props extends PageProps {
  users: {
    data: Product[];
    current_page: number;
    last_page: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: dashboard().url,
    },
];

const formSchema = z.object({
  product_name: z.string().min(2, "Invalid Product name."),
  description: z.string().min(2, "Description is required."),
  brand: z.string().min(2, "Brand must be filled."),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  alert_stock: z.coerce.number().min(0, "Alert stock cannot be negative"),
  image: z.instanceof(File).optional().or(z.string().optional()),
})

export default function Products() {
  const schedule = {edit: true, delete:true}

  //fetch products
  const { products } = usePage<props>().props;
  const [loading, setLoading] = useState(false);  
  const [editingProduct,setEditingProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingProduct,setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading,setDeleteLoading] = useState<number | null>(null);
  console.log(products);

    
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    product_name: "",
    description: "",
    brand: "",
    price: 0,
    quantity: 0,
    alert_stock: 0,
    image: undefined,
  },
});

  //update Products
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!editingProduct) return;
    setLoading(true)

    try {
      const formData = new FormData();
       formData.append("product_name", values.product_name);
      formData.append("description", values.description);
      formData.append("brand", values.brand);
      formData.append("price", values.price.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("alert_stock", values.alert_stock.toString());
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      // For Laravel compatibility
      formData.append("_method", "PUT");

      router.post(`/products/${editingProduct.id}`, formData, {
        preserveScroll: true,
        onSuccess: (page) => {
          alert("Product updated successfully!");
          setEditingProduct(null);
          setDialogOpen(false);
          form.reset();
        },
        onError:(errors)=>{
          alert("Failed to update product. Please check the form for errors.");
        },
        onFinish: () => setLoading(false),
      })
    } catch (error) {
      console.error('Update error:', error);
      setLoading(false);
    }
 }

 const handleEditClick = ( product: Product) => {
     setEditingProduct(product);
     setDialogOpen(true);
     form.reset({
      product_name: product.product_name,
      description: product.description,
      brand:product.brand,
      price:product.price,
      quantity:product.quantity,
      alert_stock:product.alert_stock,
      image: product.image || undefined,
     })
 }

 const handleDialogClose = () => {
   setDialogOpen(false);
   setEditingProduct(null);
   form.reset();
 }

 const handleDeleteProduct = (productId : number) => {

  if(!productId){
    return;
  }
  setLoading(true);
  try {
    router.delete(`/products/${productId}`,{
    preserveScroll:true,
    onSuccess:()=>{
     /*  alert("Product deleted successfully!"); */
    },
    onError:(errors)=>{
      alert("Failed to delete product.");
    },
    onFinish:()=>{
      setLoading(false);
    }
  })
  } catch (error) {
    console.error('Delete error:', error);
    setLoading(false);
  }
 }

 const handleDeleteClick = (product : Product) => {
    if(confirm(`Are you sure you want to delete the product: ${product.product_name}?`)){
      handleDeleteProduct(product.id);
    }
    setDeletingProduct(product);
 }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products"/>
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
               {/* Top section */}
        <div className='flex flex-row justify-between px-4'>
          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-1/3 mb-6">
            <div className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <Search className="ml-3 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                className="border-none focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-slate-400 px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Add User */}
          <AddProducts />
        </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                 <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">NO</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="">Quantity</TableHead>
                         <TableHead className="">Brand</TableHead>
                          <TableHead className="">Alert stock</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead >Action</TableHead>
                      </TableRow>
                    </TableHeader>
                     <TableBody>
                   {!products || products.data.length === 0 ? (
                         <TableRow>
                                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                            No product found.
                                          </TableCell>
                                        </TableRow>
                   ) : (
                    products.data.map((product,index) => (
                      
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                         <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                           <TableCell>{product.alert_stock}</TableCell>
                           <TableCell className="flex items-center gap-3">
                              {product.image ? (
                                <img
                                  src={`http://localhost:8000${product.image}`}
                                  alt={product.product_name}
                                  className="w-16 h-16 object-cover rounded-md border"
                                />
                              ) : (
                                <span className="text-gray-400">No Image</span>
                              )}
                            </TableCell>
                      <TableCell className=''>
                   <Dialog open={dialogOpen && editingProduct?.id === product.id} onOpenChange={(open) => !open && handleDialogClose()}>
                  <DialogTrigger  className="text-black ring-1 ring-slate-400 bg-slate-200 p-1 rounded-md shadow-md w-18 hover:bg-slate-300 mr-4"
                  onClick={() => handleEditClick(product)}
                  >Edit</DialogTrigger>
                { editingProduct && editingProduct.id === product.id && (
                   <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                          Update the product information below.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          {/* Current Image Preview */}
                         {/*  {editingProduct?.image && (
                            <div className="flex justify-center ">
                              <div className="text-center">
                                <p className="text-sm font-medium ">Current Image:</p>
                                <img
                                  src={`http://localhost:8000${editingProduct.image}`}
                                  alt={editingProduct.product_name}
                                  className="w-10 h-10 object-cover rounded-md border mx-auto"
                                />
                              </div>
                            </div>
                          )} */}
                          
                          <div className="flex flex-row gap-4">
                            <FormField
                              control={form.control}
                              name="product_name"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="mb-1">Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter Product name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="brand"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="mb-1">Product Brand</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter Product Brand" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex flex-row gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="mb-1">Price</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01"
                                      placeholder="Enter Product price" 
                                      {...field}
                                      value={field.value?.toString() ?? ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="mb-2">Quantity</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number"
                                      placeholder="Enter Product Quantity" 
                                      {...field}
                                      value={field.value?.toString() ?? ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="mb-1">Product Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter Product Description" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex flex-row gap-4">
                            <FormField
                              control={form.control}
                              name="alert_stock"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="mb-1">Alert Stock</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number"
                                      placeholder="Enter Alert Stock Level" 
                                      {...field}
                                      value={field.value?.toString() ?? ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="image"
                              render={({ field: { value, onChange, ...field } }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Product Image</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to keep current image
                                  </p>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            className="w-full" 
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? "Updating Product..." : "Update Product"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                )}
                </Dialog>

                       {schedule.delete && (
                        <Dialog open={deletingProduct?.id === product.id} onOpenChange={(open) => !open && setDeletingProduct(null)}>
                          <DialogTrigger 
                            className="text-white ring-1 ring-red-700 bg-red-500 p-1 rounded-md shadow-md w-18 hover:bg-red-400"
                            onClick={() => handleDeleteClick(product)}
                          >
                            Delete
                          </DialogTrigger>
                          
                          {deletingProduct && deletingProduct.id === product.id && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you absolutely sure of these Action</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete the product{" "}
                                  <strong>{deletingProduct.product_name}</strong> .
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex gap-2 sm:gap-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setDeletingProduct(null)}
                                  disabled={deleteLoading === product.id}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={deleteLoading === product.id}
                                >
                                  {deleteLoading === product.id ? (
                                    <>
                                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete Product"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      )}
                    </TableCell>
                      </TableRow>
                   
                    ))
                   )}
                    </TableBody>
                  </Table>
                </div>
            </div>
        </AppLayout>
    );
}