import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Providers from '@/app/providers';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard - Tymor',
  robots: 'noindex, nofollow',
};

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Providers>
      <div className="flex h-screen gradient-bg overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <footer className="bg-card-gradient border-t border-border/30 px-6 py-4 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="https://tymortech.com/" target="_blank">Powered by Tymor Technologies</Link>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>
              
            </div>
          </footer>
        </div>
      </div>
    </Providers>
  );
}

