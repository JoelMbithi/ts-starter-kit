

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Textarea } from "@/components/ui/textarea"
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';

interface product {
    id:number,
    name:string,
    price:number,
    description:string
}

interface props{
    product:product
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit a Product',
        href: '/products/{product.id}/edit',
    },
];

export default function Edit({product}:props) {
    const {data,setData,put,processing,errors} = useForm({
        name:product.name,
        price:product.price,
        description:product.description
    })

    const handleUpdate = (e:React.FormEvent) =>{
        e.preventDefault()
       put(route('products.update',product.id))
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update a Product" />
                <div className='flex items-center w-6/12  p-4 mt-2 '> 
                     <form onSubmit={handleUpdate} action="" className='w-full'>
                 
                    {Object.keys(errors).length > 0 &&  (
                        <Alert >
                            <CircleAlert className='text-red-500'/>
                            <AlertTitle className='text-red-500'>Errors!</AlertTitle>
                            <AlertDescription>
                               <ul>
                                {Object.entries(errors).map(([key,message]) => (
                                    <li key={key} className='text-red-500'>{message as string}</li>
                                ))}
                               </ul>
                            </AlertDescription>
                            </Alert>
                                                )}
      
                        <div className='mb-4'>
                            <Label htmlFor="product name">Name</Label>
                     <Input placeholder='Product Name' value={data.name} onChange={(e) => setData('name',e.target.value)}/>
                        </div>

                         <div className='mb-4'>
                            <Label htmlFor="product name">Price</Label>
                     <Input placeholder='Product Price' value={data.price} onChange={(e) => setData('price',e.target.value)}/>
                        </div>

                         <div className='mb-4'>
                            <Label htmlFor="product name"> Description </Label>
                        <Textarea placeholder='Description' value={data.description} onChange={(e) => setData('description',e.target.value)}/>
                        </div>

                        <Button  type='submit'>Update Product</Button>
                      </form>
                </div>
           
        </AppLayout>
    );
}
