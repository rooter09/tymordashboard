import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { createSystemNotification } from '@/lib/notifications';
import bcrypt from 'bcryptjs';

// GET all users (Super Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const users = await User.find({})
      .select('-password')
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Invite new user (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, role, password } = await req.json();

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      invitedBy: session.user.id,
    });

    // Log activity
    await ActivityLog.create({
      userId: session.user.id,
      action: 'Created user',
      entityType: 'user',
      entityId: user._id,
      details: `Created user: ${user.name} (${user.email}) with role: ${user.role}`,
    });

    // Create notification for the new user
    await createSystemNotification(
      user._id,
      'Welcome to Tymor Dashboard!',
      `Hello ${user.name}! Your account has been created successfully. You can now access the dashboard with your ${user.role} privileges.`,
      'success'
    );

    // Create notification for the admin who created the user
    await createSystemNotification(
      session.user.id,
      'User Created Successfully',
      `You have successfully created a new user: ${user.name} (${user.email}) with ${user.role} role.`,
      'success'
    );

    return NextResponse.json(
      {
        message: 'User invited successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

