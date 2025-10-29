import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="POS System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-8 w-full max-w-[400px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="text-xl font-bold text-gray-800 dark:text-white">
                            POS<span className="text-blue-600">System</span>
                        </div>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Sign In
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        )}
                    </nav>
                </header>
                
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-6xl flex-col items-center lg:flex-row lg:items-start lg:justify-between">
                        {/* Left Content */}
                        <div className="flex-1 max-w-2xl lg:pr-12">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Streamline Your Business with Our{' '}
                                    <span className="text-blue-600">POS System</span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    Professional point-of-sale solution designed to help you manage sales, 
                                    inventory, and customers efficiently. Boost your business productivity 
                                    with our intuitive platform.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Sales Tracking</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor sales and performance instantly</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Inventory Management</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Automated stock tracking and alerts</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Customer Management</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Build customer relationships and loyalty</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Detailed Reporting</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive analytics and insights</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={login()}
                                        className="rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
                                    >
                                        Sign In to Dashboard
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Start Free Trial
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Graphic */}
                        <div className="flex-1 max-w-md mt-12 lg:mt-0 lg:ml-12">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Professional POS Solution
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Trusted by businesses to streamline operations and drive growth
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Daily Transactions</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">1,247+</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">500+</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                                        <span className="font-semibold text-green-600">99.9%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} POS System. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}