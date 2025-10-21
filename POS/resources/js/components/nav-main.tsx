import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
    isCollapsed?: boolean;
}

export function NavMain({ items = [], isCollapsed = false }: NavMainProps) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 mt-10 py-0">
            <hr  className='h-2 text-black font-bold p-2'/>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url === item.href; // check if current page
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors
                                    ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}
                                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                                `}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="w-5 h-5" />}
                                    {!isCollapsed && <span>{item.title}</span>}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
