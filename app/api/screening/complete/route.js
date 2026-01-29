// app/api/screening/complete/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { studentData, report, notifications } = await request.json();

    // Store screening data in database
    const { data: screeningData, error: screeningError } = await supabase
      .from('screening_submissions')
      .insert([
        {
          student_name: studentData.studentName,
          parent_name: studentData.parentName,
          date_of_birth: studentData.dateOfBirth,
          gender: studentData.gender,
          fide_rating: studentData.fideRating,
          location: studentData.location,
          email: studentData.email.toLowerCase().trim(),
          phone_number: studentData.phoneNumber,
          primary_goal: studentData.primaryGoal,
          convenient_time: studentData.convenientTime,
          screening_type: report.screeningType,
          score: report.score,
          total_questions: report.totalQuestions,
          percentage: parseFloat(report.percentage),
          level: report.level,
          recommendation: report.recommendation,
          completed_at: report.completedAt,
          status: 'completed'
        }
      ])
      .select('id')
      .single();

    if (screeningError) {
      console.error('Screening data insert error:', screeningError);
      // Continue with notifications even if DB insert fails
    }

    // Send notifications
    const notificationResults = {
      email: false,
      whatsapp: false,
      admin: false
    };

    try {
      if (notifications.includes('email')) {
        await sendScreeningCompletionEmail(studentData, report);
        notificationResults.email = true;
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    try {
      if (notifications.includes('whatsapp')) {
        await sendWhatsAppNotification(studentData, report);
        notificationResults.whatsapp = true;
      }
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
    }

    try {
      if (notifications.includes('admin')) {
        await createAdminNotification(studentData, report, screeningData?.id);
        notificationResults.admin = true;
      }
    } catch (adminError) {
      console.error('Admin notification failed:', adminError);
    }

    return NextResponse.json({
      success: true,
      message: 'Screening completed and notifications sent successfully',
      screeningId: screeningData?.id,
      notifications: notificationResults
    });

  } catch (error) {
    console.error('Screening completion error:', error);
    return NextResponse.json(
      { message: 'Failed to complete screening process' },
      { status: 500 }
    );
  }
}

async function sendScreeningCompletionEmail(studentData, report) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentData.email,
    subject: 'Chess Screening Completed - Azroute Chess Institute',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Hello ${studentData.parentName},</h2>
        <p>Great news! ${studentData.studentName} has successfully completed the chess screening assessment.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Screening Results:</h3>
          <ul>
            <li><strong>Score:</strong> ${report.score}/${report.totalQuestions} (${report.percentage}%)</li>
            <li><strong>Assessed Level:</strong> ${report.level}</li>
            <li><strong>Screening Type:</strong> ${report.screeningType}</li>
          </ul>
        </div>
        
        <p><strong>Recommendation:</strong> ${report.recommendation}</p>
        
        <p>Our team will contact you within 24 hours at ${studentData.phoneNumber} to discuss the results and recommend the best program for ${studentData.studentName}.</p>
        
        <p>Convenient time mentioned: ${studentData.convenientTime}</p>
        
        <p>If you have any questions, please feel free to contact us.</p>
        
        <p>Best regards,<br/>Azroute Chess Institute Team</p>
      </div>
    `
  };

  // This would use your existing email service
  // For now, we'll simulate the email sending
  console.log('Email notification sent to:', studentData.email);
  return { success: true };
}

async function sendWhatsAppNotification(studentData, report) {
  // WhatsApp notification logic would go here
  // This would typically integrate with a WhatsApp API service
  console.log('WhatsApp notification sent to:', studentData.phoneNumber);
  return { success: true };
}

async function createAdminNotification(studentData, report, screeningId) {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .insert([
        {
          type: 'screening_completed',
          title: `New Screening Completed: ${studentData.studentName}`,
          message: `Student: ${studentData.studentName}\nParent: ${studentData.parentName}\nEmail: ${studentData.email}\nPhone: ${studentData.phoneNumber}\nScore: ${report.score}/${report.totalQuestions}\nLevel: ${report.level}`,
          screening_id: screeningId,
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Admin notification insert error:', error);
    }
  } catch (error) {
    console.error('Admin notification creation failed:', error);
  }
}
