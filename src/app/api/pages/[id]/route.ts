import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import ActivityLog from '@/models/ActivityLog';
import { canManageContent } from '@/lib/permissions';

// GET single page
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

    const page = await Page.findById(params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user can access this page
    if (
      session.user.role !== 'super_admin' &&
      page.createdBy._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: page }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update page
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

    const page = await Page.findById(params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user can modify this page
    const hasPermission = canManageContent(
      session.user.role as any,
      page.createdBy.toString(),
      session.user.id
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update publishedAt if status changed to published
    if (updates.status === 'published' && page.status !== 'published') {
      updates.publishedAt = new Date();
    }

    updates.updatedBy = session.user.id;

    const updatedPage = await Page.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Updated page',
      entityType: 'page',
      entityId: updatedPage!._id,
      details: `Updated page: ${updatedPage!.title}`,
    });

    return NextResponse.json(
      { message: 'Page updated successfully', data: updatedPage },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE page
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

    const page = await Page.findById(params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user can delete this page
    const hasPermission = canManageContent(
      session.user.role as any,
      page.createdBy.toString(),
      session.user.id
    );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Page.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Deleted page',
      entityType: 'page',
      entityId: params.id,
      details: `Deleted page: ${page.title}`,
    });

    return NextResponse.json(
      { message: 'Page deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

