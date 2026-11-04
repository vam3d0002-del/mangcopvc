import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'supabase', 'schema.sql');
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File schema.sql not found', { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Error reading schema.sql: ' + String(error), {
      status: 500,
    });
  }
}

