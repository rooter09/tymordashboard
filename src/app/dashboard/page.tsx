import Link from 'next/link';
import { FileText, BookOpen, Users, TrendingUp, Plus, Activity, Shield, BarChart3, Eye } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import Blog from '@/models/Blog';
import User from '@/models/User';
import Analytics from '@/models/Analytics';

async function getDashboardStats(userId: string, userRole: string) {
  try {
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get stats based on role
    const pageFilter = userRole === 'super_admin' ? {} : { createdBy: userId };
    const blogFilter = userRole === 'super_admin' ? {} : { createdBy: userId };

    const [totalPages, totalBlogs, totalUsers, totalViews] = await Promise.all([
      Page.countDocuments(pageFilter),
      Blog.countDocuments(blogFilter),
      userRole === 'super_admin' ? User.countDocuments() : Promise.resolve(0),
      Analytics.countDocuments({ visitDate: { $gte: thirtyDaysAgo } }),
    ]);

    return {
      totalPages,
      totalBlogs,
      totalUsers,
      totalViews,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPages: 0,
      totalBlogs: 0,
      totalUsers: 0,
      totalViews: 0,
    };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const stats = await getDashboardStats(session.user.id, session.user.role);
  const isSuperAdmin = session.user.role === 'super_admin';
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-white">Welcome to Tymor</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive dashboard for managing content, analytics, and user activities. 
          Stay organized and efficient with our modern interface.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pages"
          value={stats.totalPages}
          icon={FileText}
          color="bg-gradient-to-br from-cyber-blue to-blue-600"
          href="/dashboard/pages"
          description="Content pages"
        />
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon={BookOpen}
          color="bg-gradient-to-br from-cyber-green to-green-600"
          href="/dashboard/blogs"
          description="Blog posts"
        />
        {isSuperAdmin && (
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-br from-cyber-purple to-purple-600"
            href="/dashboard/users"
            description="Registered users"
          />
        )}
        <StatCard
          title="Page Views"
          value={stats.totalViews}
          icon={Eye}
          color="bg-gradient-to-br from-cyber-orange to-orange-600"
          href="/dashboard/analytics"
          description="Last 30 days"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions isSuperAdmin={isSuperAdmin} />
        <RecentActivity />
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  href,
  description
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  href?: string;
  description?: string;
}) {
  const content = (
    <div className="card-gradient rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-border/20 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
        {title}
      </h3>
    </div>
  );
  
  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  
  return content;
}

function QuickActions({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <div className="card-gradient rounded-2xl p-6 border border-border/20">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
        Quick Actions
      </h3>
      <div className="space-y-4">
        <Link 
          href="/dashboard/pages/new" 
          className="block px-6 py-4 bg-gradient-to-r from-cyber-blue to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-center font-medium group"
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Page
          </div>
        </Link>
        <Link 
          href="/dashboard/blogs/new" 
          className="block px-6 py-4 bg-gradient-to-r from-cyber-green to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 text-center font-medium group"
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Create New Blog Post
          </div>
        </Link>
        {isSuperAdmin && (
          <Link 
            href="/dashboard/users" 
            className="block px-6 py-4 bg-gradient-to-r from-cyber-purple to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 text-center font-medium group"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Manage Users
            </div>
          </Link>
        )}
        <Link 
          href="/dashboard/analytics" 
          className="block px-6 py-4 bg-gradient-to-r from-cyber-orange to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 text-center font-medium group"
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5" />
            View Analytics
          </div>
        </Link>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="card-gradient rounded-2xl p-6 border border-border/20">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        Recent Activity
      </h3>
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No recent activity</p>
          <p className="text-sm text-muted-foreground/70">Activity will appear here as you make changes</p>
        </div>
      </div>
    </div>
  );
}


