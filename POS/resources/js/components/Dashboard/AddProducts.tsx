"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import { router } from "@inertiajs/react"

// Updated form schema
const formSchema = z.object({
  product_name: z.string().min(2, "Invalid Product name."),
  description: z.string().min(2, "Description is required."),
  brand: z.string().min(2, "Brand must be filled."),
  price: z.string().min(1, "Price is required.").refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a number",
  }),
  quantity: z.string().min(1, "Quantity is required.").refine((val) => !isNaN(parseInt(val)), {
    message: "Quantity must be a number",
  }),
  alert_stock: z.string().min(1, "Alert stock is required.").refine((val) => !isNaN(parseInt(val)), {
    message: "Alert stock must be a number",
  }),
  image: z.instanceof(File).optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

const AddProducts = () => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      description: "",
      brand: "",
      price: "",
      quantity: "",
      alert_stock: "",
      image: undefined,
    },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('product_name', values.product_name)
      formData.append('description', values.description)
      formData.append('brand', values.brand)
      formData.append('price', values.price)
      formData.append('quantity', values.quantity)
      formData.append('alert_stock', values.alert_stock)
      
      // Only append image if it exists and is a File
      if (values.image && values.image instanceof File) {
        formData.append('image', values.image)
      }

      console.log('Submitting form data...')
      
      const response = await axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      console.log("Product Created", response.data)
      alert("Product Created Successfully!")
      form.reset()
      setIsOpen(false)
      router.reload() 
      
    } catch (error: any) {
      console.log('Error details:', error)
      if (error.response) {
        // Server responded with error status
        console.log('Server error:', error.response.data)
        alert(`Error: ${error.response.data.message || 'Failed to create product'}`)
      } else if (error.request) {
        // Request was made but no response received
        console.log('Network error:', error.request)
        alert('Network error: Please check your connection')
      } else {
        // Something else happened
        console.log('Error:', error.message)
        alert('Error: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-10">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger 
          className="bg-slate-900 p-2 px-4 text-white rounded font-medium shadow hover:ring-1 hover:bg-white hover:text-black hover:ring-slate-400"
          onClick={() => setIsOpen(true)}
        >
          Create a Product
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create A Product</DialogTitle>
            <DialogDescription className="text-gray-500 mb-4">
              Fill in the details below to add a new product to the system.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Textarea placeholder="Enter Product Description" {...field} />
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
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                className="w-full" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Product..." : "Create Product"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddProducts