import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BarChart3, Users, FileText, BookOpen, Activity, ArrowRight, Star, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Tymor Technologies"
              width={200}
              height={60}
              className="object-contain w-auto h-8 sm:h-10 md:h-11 lg:h-12 xl:h-14"
            />
          </Link>
              
            </div>
            <Link href="/auth/signin">
              <Button variant="gradient" className="px-6">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            
            <h1 className="text-5xl font-bold text-white">Welcome to Tymor Dashboard</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your comprehensive admin dashboard for managing content, analytics, and user activities. 
            Built with modern technology and designed for efficiency.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="gradient" className="px-8">
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="https://tymortech.com" target="_blank">
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage your platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Create and manage pages and blog posts with our intuitive editor
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-green to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track performance and insights with comprehensive analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-purple to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and permissions with role-based access control
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-orange to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Activity Monitoring</CardTitle>
                <CardDescription>
                  Real-time activity logs and system monitoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Secure Access</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted authentication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-green to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Fast Performance</CardTitle>
                <CardDescription>
                  Optimized for speed with modern web technologies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-muted-foreground">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">Fast</div>
              <div className="text-muted-foreground">Performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="card-gradient border-border/20">
            <CardContent className="py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Access your admin dashboard and start managing your platform today
              </p>
              <Link href="/auth/signin">
                <Button size="lg" variant="gradient" className="px-8">
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xl font-bold text-white">Tymor</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Tymor Technologies. All rights reserved. Built with modern technology.
          </p>
        </div>
      </footer>
    </div>
  );
}

