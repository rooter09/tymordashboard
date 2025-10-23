import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { createSystemNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
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
        { error: 'User already exists' },
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
      role: role || 'content_admin',
    });

    // Log activity (self-registration)
    await ActivityLog.create({
      userId: user._id,
      action: 'Registered',
      entityType: 'user',
      entityId: user._id,
      details: `User registered: ${user.name} (${user.email})`,
    });

    // Create welcome notification
    await createSystemNotification(
      user._id,
      'Welcome to Tymor Dashboard!',
      `Hello ${user.name}! Welcome to the Tymor Dashboard. Your account has been successfully created and you can now start managing your content.`,
      'success'
    );

    return NextResponse.json(
      {
        message: 'User created successfully',
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

