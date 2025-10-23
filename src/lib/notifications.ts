import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export async function createNotification(data: CreateNotificationData) {
  try {
    await connectDB();
    
    const notification = await Notification.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

export async function createSystemNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  return createNotification({
    userId,
    title,
    message,
    type,
  });
}
