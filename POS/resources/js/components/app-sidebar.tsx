import { useState } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
  LayoutGrid, ClipboardList,User, Folder,CreditCard, Package, Smartphone, BarChart2, Truck, Users, Inbox, 
  BookOpen
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
 { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
  { title: 'Orders', href: '/orders', icon: ClipboardList },
  { title: 'Transaction', href: '/transactions', icon: CreditCard },
  { title: 'Products', href: '/products', icon: Package },
  { title: 'Cashier', href: '/cashier', icon: Smartphone },
  { title: 'Report', href: '/reports', icon: BarChart2 },
  { title: 'Suppliers', href: '/suppliers', icon: Truck },
  { title: 'Customers', href: '/customers', icon: Users },
  { title: 'Incoming', href: '/incoming', icon: Inbox },
  { title: 'Users', href: '/users', icon: User },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`
                flex flex-col transition-all duration-300
                ${isOpen ? 'w-64' : 'w-16'}
                bg-slate-100 text-gray-900 dark:bg-gray-900 dark:text-white
                hover:bg-gray-100 dark:hover:bg-slate-800
            `}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Sidebar Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem >
                        <SidebarMenuButton size="lg" asChild>
                            <Link  href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main navigation */}
            <SidebarContent className={`active:bg-blue-400`} >
                <NavMain  items={mainNavItems} isCollapsed={!isOpen} />
            </SidebarContent>

            {/* Footer navigation and user info */}
            <SidebarFooter className="mt-auto">
               {/*  <NavFooter items={footerNavItems} isCollapsed={!isOpen} /> */}
                <NavUser isCollapsed={!isOpen} />
            </SidebarFooter>
        </div>
    );
}
