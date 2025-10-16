

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



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a New Product',
        href: '/products/create',
    },
];

export default function Index() {
    const {data,setData,post,processing,errors} = useForm({
        name:'',
        price:'',
        description:''
    })

    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault()
       post(route('products.store'))
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a New Product" />
                <div className='flex items-center w-6/12  p-4 mt-2 '> 
                     <form onSubmit={handleSubmit} action="" className='w-full'>
                 
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

                        <Button  type='submit'>Add Product</Button>
                      </form>
                </div>
           
        </AppLayout>
    );
}
