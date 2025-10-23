'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Activity, FileText, BookOpen, User, Settings } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActivityLog {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  action: string;
  entityType: 'page' | 'blog' | 'user' | 'settings';
  details?: string;
  createdAt: string;
}

const entityIcons = {
  page: FileText,
  blog: BookOpen,
  user: User,
  settings: Settings,
};

const entityColors = {
  page: 'bg-blue-100 text-blue-800',
  blog: 'bg-green-100 text-green-800',
  user: 'bg-purple-100 text-purple-800',
  settings: 'bg-gray-100 text-gray-800',
};

export default function ActivityPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/activity-logs' 
        : `/api/activity-logs?entityType=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setLogs(data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch activity logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-2">Track all changes made in the dashboard</p>
        </div>
        <div className="w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="page">Pages Only</SelectItem>
              <SelectItem value="blog">Blogs Only</SelectItem>
              <SelectItem value="user">Users Only</SelectItem>
              <SelectItem value="settings">Settings Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No activity logs found</p>
              <p className="text-sm text-gray-400 mt-2">
                Activity will appear here as you make changes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const Icon = entityIcons[log.entityType];
                const colorClass = entityColors[log.entityType];
                
                return (
                  <div key={log._id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className={`p-2 rounded ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      {log.details && (
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{log.userId.name}</span>
                        <span>•</span>
                        <span>{formatDate(log.createdAt)}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${colorClass}`}>
                          {log.entityType.charAt(0).toUpperCase() + log.entityType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

