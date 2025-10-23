import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import ActivityLog from '@/models/ActivityLog';

// GET all blogs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Super admin can see all blogs, content admin only sees their own
    const filter = session.user.role === 'super_admin' 
      ? {} 
      : { createdBy: session.user.id };

    const blogs = await Blog.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blogData = await req.json();

    await connectDB();

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    // Create blog
    const blog = await Blog.create({
      ...blogData,
      createdBy: session.user.id,
      publishedAt: blogData.status === 'published' ? new Date() : null,
    });

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Created blog',
      entityType: 'blog',
      entityId: blog._id,
      details: `Created blog: ${blog.title}`,
    });

    return NextResponse.json(
      { message: 'Blog created successfully', data: blog },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

