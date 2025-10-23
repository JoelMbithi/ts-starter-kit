import WelcomeBanner from '@/components/Dashboard/WelcomingBanner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AddUser from '@/components/Dashboard/AddUser';
import { useState } from 'react';
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Fixed form schema - passwords are optional for updates
const formSchema = z.object({
  fullname: z.string().min(2, { message: "Invalid name." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  role: z.string(),
  password: z.string().min(8).optional().or(z.literal('')),
  confirmPassword: z.string().min(8).optional().or(z.literal('')),
}).refine((data) => {
  // Only validate password match if password is provided
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  is_admin: number;
}

interface PageProps {
  [key: string]: any;
}

interface props extends PageProps {
   users: {
    data: User[];
    current_page: number;
    last_page: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: dashboard().url,
  },
];

interface schedule {
  edit: string;
  delete: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
      const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Fetch users
  const { users } = usePage<props>().props;
  const schedule = { edit: true, delete: true };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      role: "1", 
      password: "",
      confirmPassword: "",
    },
  });

    const getRoleName = (isAdmin: number) => isAdmin === 1 ? 'Admin' : 'Cashier';
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editingUser) return;

    setLoading(true);
    /* console.log('Starting update for user:', editingUser.id);
    console.log('Form values:', values);
 */
    try {
      const formData: any = {
        _method: "PUT",
        name: values.fullname,
        email: values.email,
        phone_number: values.phoneNumber,
        is_admin: Number(values.role),
      };

      // Only include password if provided and not empty
      if (values.password && values.password.trim() !== '') {
        formData.password = values.password;
       /*  console.log('Including password in update'); */
      }

     /*  console.log('Sending data:', formData); */

      router.post(`/users/${editingUser.id}`, formData, {
        preserveScroll: true,
        onSuccess: (page) => {
          /* console.log('Update successful:', page); */
          alert("User updated successfully!");
          setEditingUser(null);
          form.reset();
        },
        onError: (errors) => {
         /*  console.error('Update errors:', errors); */
          let errorMessage = " Failed to update user.";
          if (errors.message) {
            errorMessage += ` Error: ${errors.message}`;
          } else if (typeof errors === 'object') {
            errorMessage += ` Errors: ${JSON.stringify(errors)}`;
          }
          alert(errorMessage);
        },
        onFinish: () => {
        /*   console.log('Request finished'); */
          setLoading(false);
        },
      });

    } catch (error) {
    /*   console.error("Unexpected error:", error); */
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    /* console.log('Editing user:', user); */
    setEditingUser(user);
    form.reset({
      fullname: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
      role: String(user.is_admin),
      password: "",
      confirmPassword: "",
    });
  };

 // Delete user function
  const handleDeleteUser = async (userId: number) => {
    if (!userId) return;

    setDeleteLoading(userId);
   /*  console.log('Deleting user:', userId); */

    try {
      router.delete(`/users/${userId}`, {
        preserveScroll: true,
        onSuccess: () => {
         /*  console.log('Delete successful'); */
          alert(" User deleted successfully!");
          setDeletingUser(null);
        },
        onError: (errors) => {
        /*   console.error('Delete errors:', errors); */
          let errorMessage = "Failed to delete user.";
          if (errors.message) {
            errorMessage += ` Error: ${errors.message}`;
          }
          alert(errorMessage);
        },
        onFinish: () => {
          setDeleteLoading(null);
        },
      });
    } catch (error) {
     /*  console.error("Unexpected error:", error); */
      alert("Something went wrong!");
      setDeleteLoading(null);
    }
  };

    const handleDeleteClick = (user: User) => {
    /* console.log('Preparing to delete user:', user); */
    setDeletingUser(user);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 justify-center flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Top section */}
        <div className='flex flex-row justify-between px-4'>
          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-1/3 mb-6">
            <div className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <Search className="ml-3 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search users..."
                className="border-none focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-slate-400 px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Add User */}
          <AddUser />
        </div>

        <div className="relative min-h-[100vh] p-3 flex-1 overflow-hidden rounded-xl border border-slate-300 shadow md:min-h-min dark:border-sidebar-border">
          <Table>
            <TableCaption>List of all registered users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">NO</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!users || users.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.data.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>{getRoleName(user.is_admin)}</TableCell>
                   
                    <TableCell className=''>
                      {schedule.edit && (
                        <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                          <DialogTrigger
                            className="text-black ring-1 ring-slate-400 bg-slate-200 p-1 rounded-md shadow-md w-18 hover:bg-slate-300 mr-4"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </DialogTrigger>

                          {editingUser && editingUser.id === user.id && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>

                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                  <div className="flex items-center flex-row gap-4">
                                    <FormField
                                      control={form.control}
                                      name="fullname"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              className="ring-1 ring-slate-400 p-1 rounded-md shadow-md px-2"
                                              placeholder="Enter full name"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
                                          <FormControl>
                                            <Input
                                              className="ring-1 ring-slate-400 p-1 rounded-md shadow-md px-2"
                                              placeholder="Enter email address"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="flex items-center flex-row gap-4">
                                    <FormField
                                      control={form.control}
                                      name="phoneNumber"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Phone Number</FormLabel>
                                          <FormControl>
                                            <Input
                                              className="ring-1 ring-slate-400 p-1 rounded-md shadow-md px-2"
                                              placeholder="Enter phone number"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name="role"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Role</FormLabel>
                                          <FormControl>
                                            <select
                                              {...field}
                                              className="p-1 bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-700 shadow-md rounded-sm w-56"
                                            >
                                              <option value="1">Admin</option>
                                              <option value="2">Cashier</option>
                                            </select>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  {/* Optional password fields */}
                                  <div className="flex items-center flex-row gap-4">
                                    <FormField
                                      control={form.control}
                                      name="password"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>New Password (Optional)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="password"
                                              className="ring-1 ring-slate-400 p-1 rounded-md shadow-md px-2"
                                              placeholder="Leave blank to keep current"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name="confirmPassword"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Confirm Password</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="password"
                                              className="ring-1 ring-slate-400 p-1 rounded-md shadow-md px-2"
                                              placeholder="Confirm new password"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <Button 
                                    type="submit" 
                                    className="w-full flex justify-center items-center gap-2"
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        <span>Updating...</span>
                                      </>
                                    ) : (
                                      "Update User"
                                    )}
                                  </Button>
                                </form>
                              </Form>
                            </DialogContent>
                          )}
                        </Dialog>
                      )}

                       {schedule.delete && (
                        <Dialog open={deletingUser?.id === user.id} onOpenChange={(open) => !open && setDeletingUser(null)}>
                          <DialogTrigger 
                            className="text-white ring-1 ring-red-700 bg-red-500 p-1 rounded-md shadow-md w-18 hover:bg-red-400"
                            onClick={() => handleDeleteClick(user)}
                          >
                            Delete
                          </DialogTrigger>
                          
                          {deletingUser && deletingUser.id === user.id && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you absolutely sure of these Action</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete the user{" "}
                                  <strong>{deletingUser.name}</strong> ({deletingUser.email}).
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex gap-2 sm:gap-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setDeletingUser(null)}
                                  disabled={deleteLoading === user.id}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={deleteLoading === user.id}
                                >
                                  {deleteLoading === user.id ? (
                                    <>
                                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete User"
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