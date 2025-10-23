import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import ActivityLog from '@/models/ActivityLog';

// GET all pages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Super admin can see all pages, content admin only sees their own
    const filter = session.user.role === 'super_admin' 
      ? {} 
      : { createdBy: session.user.id };

    const pages = await Page.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: pages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new page
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pageData = await req.json();

    await connectDB();

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: pageData.slug });
    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      );
    }

    // Create page
    const page = await Page.create({
      ...pageData,
      createdBy: session.user.id,
      publishedAt: pageData.status === 'published' ? new Date() : null,
    });

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Created page',
      entityType: 'page',
      entityId: page._id,
      details: `Created page: ${page.title}`,
    });

    return NextResponse.json(
      { message: 'Page created successfully', data: page },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

