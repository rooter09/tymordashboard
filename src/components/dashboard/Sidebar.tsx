'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Users, 
  BarChart3,
  Activity,
  LogOut,
  Shield,
  Settings
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  requiresSuperAdmin?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pages', href: '/dashboard/pages', icon: FileText },
  { label: 'Blogs', href: '/dashboard/blogs', icon: BookOpen },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Activity Logs', href: '/dashboard/activity', icon: Activity },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { 
    label: 'Users', 
    href: '/dashboard/users', 
    icon: Users,
    requiresSuperAdmin: true 
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requiresSuperAdmin) {
      return userRole === 'super_admin';
    }
    return true;
  });
  
  return (
    <aside className="w-64 card-gradient text-white flex-shrink-0 flex flex-col h-screen border-r border-border/30 backdrop-blur-sm">
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Tymor Technologies" 
          />
          
        </div>
      </div>
      
      <nav className="mt-6 flex-1 px-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href + '/') && item.href !== '/dashboard');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/15' 
                  : 'hover:bg-secondary/50 text-muted-foreground hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-white'
              }`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-secondary/40">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {userRole === 'super_admin' ? 'Super Admin' : 'Content Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-white"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

