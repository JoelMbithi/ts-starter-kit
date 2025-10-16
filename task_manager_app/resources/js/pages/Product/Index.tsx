
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert } from '@/components/ui/alert';

interface ProductProps{
    id:number,
    name:string,
    price:number,
    description:string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/products',
    },
];

export default function Index({products}: ProductProps) {
  const  {processing,delete:destroy} = useForm()
    const handleDelete = (id:number,name:string) => {
        if(confirm("Are you sure you want to delete " + name)){
            /* destroy(`/products/${id}`) */
            destroy(route('product.destroy', id))
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                  <Link href={route('product.create')}>
                <Button>
                  Create Product
                </Button>
                </Link>
                      {products.length > 0  && (
                        <div className='mt-4'>
                              <Table>
                <TableCaption>A list of your recent Products.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell> {product.price}</TableCell>
                         <TableCell> {product.description}</TableCell>
                        <TableCell className="text-center space-x-2">
                           <Link href={route('product.edit',product.id) }>
                            <Button className='bg-slate-400 text-white hover:text-black hvover:bg-stale-700'>Edit</Button></Link>
                            <Button disabled={processing} className='bg-red-500 text-white hover:bg-red-700' onClick={() => handleDelete(product.id,product.name)}>Delete</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                        </div>
                            )}
            </div>

      
        </AppLayout>
    );
}
