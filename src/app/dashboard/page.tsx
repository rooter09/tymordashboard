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
import ActivityLog from '@/models/ActivityLog';

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
    <div className="space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="text-center py-12">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-white text-shadow mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Welcome to Tymor
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your comprehensive dashboard for managing content, analytics, and user activities. 
          <span className="text-primary font-medium"> Stay organized and efficient</span> with our modern interface.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-scale-in">
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
    <div className="card-gradient rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-border/30 group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`${color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">{value}</p>
            <p className="text-sm text-muted-foreground font-medium">{description}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
      </div>
    </div>
  );
  
  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  
  return content;
}

function QuickActions({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <div className="card-gradient rounded-3xl p-8 border border-border/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-4 text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          Quick Actions
        </h3>
        <div className="space-y-5">
          <Link 
            href="/dashboard/pages/new" 
            className="flex items-center gap-4 px-6 py-4 text-white hover:text-primary transition-all duration-300 group rounded-2xl border border-white/20 hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-electric-blue/20 to-electric-blue/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
              <FileText className="w-5 h-5 text-electric-blue" />
            </div>
            <span className="font-semibold text-lg relative z-10">Create New Page</span>
          </Link>
          <Link 
            href="/dashboard/blogs/new" 
            className="flex items-center gap-4 px-6 py-4 text-white hover:text-primary transition-all duration-300 group rounded-2xl border border-white/20 hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-green/20 to-cyber-green/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
              <BookOpen className="w-5 h-5 text-cyber-green" />
            </div>
            <span className="font-semibold text-lg relative z-10">Create New Blog Post</span>
          </Link>
          {isSuperAdmin && (
            <Link 
              href="/dashboard/users" 
              className="flex items-center gap-4 px-6 py-4 text-white hover:text-primary transition-all duration-300 group rounded-2xl border border-white/20 hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-electric-purple/20 to-electric-purple/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Users className="w-5 h-5 text-electric-purple" />
              </div>
              <span className="font-semibold text-lg relative z-10">Manage Users</span>
            </Link>
          )}
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center gap-4 px-6 py-4 text-white hover:text-primary transition-all duration-300 group rounded-2xl border border-white/20 hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-orange/20 to-cyber-orange/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
              <BarChart3 className="w-5 h-5 text-cyber-orange" />
            </div>
            <span className="font-semibold text-lg relative z-10">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function RecentActivity() {
  try {
    await connectDB();
    
    // Get recent activity logs (last 5)
    const recentLogs = await ActivityLog.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return (
      <div className="card-gradient rounded-2xl p-6 border border-border/30">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentLogs.length > 0 ? (
            recentLogs.map((log: any) => (
              <div key={log._id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    by {log.userId?.name || 'Unknown'} • {new Date(log.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No recent activity</p>
              <p className="text-sm text-muted-foreground/70">Activity will appear here as you make changes</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="card-gradient rounded-2xl p-6 border border-border/30">
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
            <p className="text-muted-foreground mb-2">Unable to load activity</p>
            <p className="text-sm text-muted-foreground/70">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }
}


