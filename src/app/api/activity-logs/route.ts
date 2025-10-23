import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const entityType = searchParams.get('entityType');

    const filter: any = {};
    
    // Content admins can only see their own activity
    if (session.user.role === 'content_admin') {
      filter.userId = session.user.id;
    }

    if (entityType) {
      filter.entityType = entityType;
    }

    const logs = await ActivityLog.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

