// src/app/api/auth/login/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, user } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    // Updated cookies API usage
    const cookieStore = await cookies();
    await cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Authentication successful',
      user: user // Optionally return user info
    });
  } catch (error) {
    console.error('API login error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}