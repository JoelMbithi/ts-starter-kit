import WelcomeBanner from '@/components/Dashboard/WelcomingBanner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-row w-full gap-4 ">
                    <div className="relative aspect-video w-3/5 overflow-hidden rounded border border-sidebar-border/70 dark:border-sidebar-border">
                      {/* top section */}
                      <div className='p-4 ring-1 ring-slate-400'  style={{ backgroundColor: '#008B8B' }}>
                         {/* animated header */}
                         <WelcomeBanner/>
                      </div>
                     
                    </div>
                    <div className="relative aspect-video w-2/5 overflow-hidden  rounded border border-sidebar-border/70 dark:border-sidebar-border">
                       <div className='p-4 ring-1 ring-slate-400'>Dashboard</div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
