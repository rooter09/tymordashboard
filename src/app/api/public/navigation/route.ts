import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

// GET navigation items (public endpoint)
export async function GET(req: NextRequest) {
  try {
    // First try to get from database if you have a Navigation model
    // Otherwise, read from JSON file
    const filePath = path.join(process.cwd(), 'data', 'navigation.json');
    
    let navigationData = [];
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      navigationData = JSON.parse(fileContent);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: navigationData 
    }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_MAIN_SITE || 'https://tymortech.com',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_MAIN_SITE || 'https://tymortech.com',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

