import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Directory exists
    }
    
    const filename = `survey-${Date.now()}.json`;
    const filePath = path.join(uploadsDir, filename);
    
    await writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, filename });
  } catch (error: any) {
    console.error('Failed to save survey:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to save survey' },
      { status: 500 }
    );
  }
}