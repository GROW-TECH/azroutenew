// app/api/auth/teacher/signup/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const {
      name,
      specialty,
      email,
      phone,
      location,
      password,
      bio,
    } = await request.json();

    // Basic validation (only coaches table fields)
    if (!name || !specialty || !email || !phone || !location) {
      return NextResponse.json(
        { message: 'Name, specialty, email, phone and location are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists in coaches
    const { data: existing, error: existingError } = await supabase
      .from('coaches')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1);

    if (existingError) {
      console.error('Supabase email check error:', existingError);
      return NextResponse.json(
        { message: 'Error checking existing email' },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Insert new coach
    const { data, error } = await supabase
      .from('coaches')
      .insert([
        {
          name: name.trim(),
          specialty: specialty.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          location: location.trim(),
          // if password is empty, we omit it so DB default 'Azroute@1234' is used
          ...(password ? { password } : {}),
          bio: bio?.trim() || null,
        },
      ])
      .select('id, coach_display_id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { message: 'Failed to create coach account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Registration successful! You can now log in as a coach.',
      coachId: data.id,
      coachDisplayId: data.coach_display_id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
