'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { TrendingUp, Eye, Globe, Monitor, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  viewsByPage: Array<{ _id: string; count: number }>;
  viewsByDate: Array<{ _id: string; count: number }>;
  topReferrers: Array<{ _id: string; count: number }>;
  deviceBreakdown: Array<{ _id: string; count: number }>;
  browserBreakdown: Array<{ _id: string; count: number }>;
  countryBreakdown: Array<{ _id: string; count: number }>;
}

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('30');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${days}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your website performance</p>
        </div>
        <div className="w-48">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.viewsByPage.length || 0}</div>
            <p className="text-xs text-muted-foreground">Pages with views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.deviceBreakdown.length || 0}</div>
            <p className="text-xs text-muted-foreground">Device types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.countryBreakdown.length || 0}</div>
            <p className="text-xs text-muted-foreground">Unique countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.viewsByPage.slice(0, 10).map((page, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{page._id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{page.count} views</span>
                  </div>
                </div>
              ))}
              {(!data?.viewsByPage || data.viewsByPage.length === 0) && (
                <p className="text-gray-500 text-center py-8">No page views recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.topReferrers.slice(0, 10).map((referrer, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{referrer._id || 'Direct'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{referrer.count} visits</span>
                  </div>
                </div>
              ))}
              {(!data?.topReferrers || data.topReferrers.length === 0) && (
                <p className="text-gray-500 text-center py-8">No referrer data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.deviceBreakdown.map((device, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{device._id || 'Unknown'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{device.count} visits</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ 
                          width: `${((device.count / (data?.totalViews || 1)) * 100).toFixed(0)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.deviceBreakdown || data.deviceBreakdown.length === 0) && (
                <p className="text-gray-500 text-center py-8">No device data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Browser Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.browserBreakdown.map((browser, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{browser._id || 'Unknown'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{browser.count} visits</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${((browser.count / (data?.totalViews || 1)) * 100).toFixed(0)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.browserBreakdown || data.browserBreakdown.length === 0) && (
                <p className="text-gray-500 text-center py-8">No browser data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

