'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Settings, 
  DollarSign, 
  BarChart3,
  Calendar,
  HelpCircle, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'history', label: 'Call History', icon: Calendar, path: '/dashboard/history' },
    { id: 'payouts', label: 'Payouts', icon: DollarSign, path: '/dashboard/payouts' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/dashboard/support' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-gray-800/50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/30 p-1">
              <Image 
                src="/logo.svg" 
                alt="CallSubs Logo" 
                width={24} 
                height={24}
                className="w-full h-full"
              />
            </div>
            <span className="font-semibold text-white">CallSubs</span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <span className="text-white font-semibold text-sm">
                {useSession().data?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {useSession().data?.user?.name}
              </p>
              <p className="text-xs text-gray-400">Streamer</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400 font-medium shadow-lg shadow-purple-600/10 border border-purple-500/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/50">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    if (pathname === '/dashboard/history') return 'Call History';
    if (pathname === '/dashboard/payouts') return 'Payouts';
    if (pathname === '/dashboard/settings') return 'Settings';
    if (pathname === '/dashboard/support') return 'Support';
    return 'Dashboard';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#1a1a1a] border-b border-gray-800/50 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          </div>
          
          {/* User Profile in Header (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-10 h-10 rounded-full border-2 border-purple-500/30" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <span className="text-white font-semibold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{session.user?.name}</p>
              <p className="text-xs text-gray-400">Streamer</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}