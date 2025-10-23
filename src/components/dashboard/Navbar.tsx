'use client';

import Link from 'next/link';
import { Bell, Home, Search, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-card-gradient border-b border-border/20 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-64 bg-secondary/30 border-border/30 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <img 
              src="/logo.png" 
              alt="Tymor" 
              className="w-8 h-8 rounded-lg"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

