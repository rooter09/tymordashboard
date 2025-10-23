import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Analytics from '@/models/Analytics';

// GET analytics data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total views
    const totalViews = await Analytics.countDocuments({
      visitDate: { $gte: startDate },
    });

    // Get views by page
    const viewsByPage = await Analytics.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      { $group: { _id: '$pageUrl', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get views by date
    const viewsByDate = await Analytics.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top referrers
    const topReferrers = await Analytics.aggregate([
      { 
        $match: { 
          visitDate: { $gte: startDate },
          referrer: { $exists: true, $ne: '' }
        } 
      },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get device breakdown
    const deviceBreakdown = await Analytics.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get browser breakdown
    const browserBreakdown = await Analytics.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get country breakdown
    const countryBreakdown = await Analytics.aggregate([
      { 
        $match: { 
          visitDate: { $gte: startDate },
          country: { $exists: true, $ne: '' }
        } 
      },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      totalViews,
      viewsByPage,
      viewsByDate,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
      countryBreakdown,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Track page view
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    await connectDB();

    // Extract user agent info (simplified version)
    const userAgent = req.headers.get('user-agent') || '';
    const device = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
    const browser = /chrome/i.test(userAgent) 
      ? 'Chrome' 
      : /firefox/i.test(userAgent) 
      ? 'Firefox' 
      : /safari/i.test(userAgent)
      ? 'Safari'
      : 'Other';

    await Analytics.create({
      pageUrl: data.pageUrl,
      pageTitle: data.pageTitle,
      referrer: data.referrer,
      userAgent,
      device,
      browser,
      sessionId: data.sessionId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

