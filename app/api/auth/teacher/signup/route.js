// app/api/auth/teacher/signup/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendCoachApplicationNotification } from '@/lib/email';

export async function POST(request) {
  try {
    const {
      name,
      specialty,
      email,
      phone,
      location,
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

    // Insert new coach application
    const { data, error } = await supabase
      .from('coaches')
      .insert([
        {
          name: name.trim(),
          specialty: specialty.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          location: location.trim(),
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

    // Send email notification to the applicant
    try {
      await sendCoachApplicationNotification({
        email: normalizedEmail,
        name: name.trim(),
        specialty: specialty.trim(),
        phone: phone.trim(),
        location: location.trim()
      });
    } catch (emailError) {
      console.error('Failed to send coach application email:', emailError);
      // Continue with response even if email fails
    }

    return NextResponse.json({
      message: 'Coach application submitted successfully! We will contact you soon.',
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
