import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import ActivityLog from '@/models/ActivityLog';
import { canManageContent } from '@/lib/permissions';

// GET single blog
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const blog = await Blog.findById(params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if user can access this blog
    if (
      session.user.role !== 'super_admin' &&
      blog.createdBy._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update blog
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    await connectDB();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if user can modify this blog
    const hasPermission = canManageContent(
      session.user.role as any,
      blog.createdBy.toString(),
      session.user.id
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update publishedAt if status changed to published
    if (updates.status === 'published' && blog.status !== 'published') {
      updates.publishedAt = new Date();
    }

    updates.updatedBy = session.user.id;

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Updated blog',
      entityType: 'blog',
      entityId: updatedBlog!._id,
      details: `Updated blog: ${updatedBlog!.title}`,
    });

    return NextResponse.json(
      { message: 'Blog updated successfully', data: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if user can delete this blog
    const hasPermission = canManageContent(
      session.user.role as any,
      blog.createdBy.toString(),
      session.user.id
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Blog.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Deleted blog',
      entityType: 'blog',
      entityId: params.id,
      details: `Deleted blog: ${blog.title}`,
    });

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

