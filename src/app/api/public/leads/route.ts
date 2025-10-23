import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

// POST - Submit a new lead (public endpoint for contact forms)
export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !leadData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Save to database or file
    const filePath = path.join(process.cwd(), 'data', 'leads.json');
    let leads = [];
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      leads = JSON.parse(fileContent);
    }
    
    // Create new lead
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      status: 'new',
      source: 'website',
      createdAt: new Date().toISOString(),
    };
    
    leads.push(newLead);
    
    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2));
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        data: { id: newLead.id }
      },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_MAIN_SITE || 'https://tymortech.com',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit lead' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

