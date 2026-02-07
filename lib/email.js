import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/* ===================== MAIN GENERIC EMAIL ===================== */

export async function sendEmail({ to, subject, template, data }) {
  const templates = {
    /* ---------- EVENT REGISTRATION ---------- */
    'event-registration': ({ eventTitle, eventDate, ticketType, registrationId }) => `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for registering for ${eventTitle}!</h2>
        <ul>
          <li><strong>Event Date:</strong> ${new Date(eventDate).toLocaleString()}</li>
          <li><strong>Ticket Type:</strong> ${ticketType}</li>
          <li><strong>Registration ID:</strong> ${registrationId}</li>
        </ul>
        <p>We look forward to seeing you!</p>
      </div>
    `,

    /* ---------- SCREENING COMPLETED (NEW) ---------- */
    'screening-completed': ({
      studentName,
      parentName,
      score,
      totalQuestions,
      percentage,
      level,
      screeningType,
      recommendation,
      phoneNumber,
      convenientTime,
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Hello ${parentName},</h2>

        <p>
          <strong>${studentName}</strong> has successfully completed the chess screening assessment.
        </p>

        <h3>Screening Results</h3>
        <ul>
          <li><strong>Score:</strong> ${score}/${totalQuestions} (${percentage}%)</li>
          <li><strong>Level:</strong> ${level}</li>
          <li><strong>Screening Type:</strong> ${screeningType}</li>
        </ul>

        <h3>Recommendation</h3>
        <p>${recommendation}</p>

        <p>
          Our team will contact you within 24 hours on
          <strong>${phoneNumber}</strong>.
        </p>

        <p><strong>Preferred Time:</strong> ${convenientTime}</p>

        <br/>
        <p>Best regards,<br/><strong>Azroute Chess Institute</strong></p>
      </div>
    `,
  };

  if (!templates[template]) {
    throw new Error(`Email template '${template}' not found`);
  }

  const html = templates[template](data);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    throw new Error('Failed to send email');
  }
}

/* ===================== PASSWORD RESET ===================== */

export async function sendPasswordResetEmail({ email, name, token, role }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const resetUrl = `${baseUrl}/auth/${role}/reset-password?token=${token}`;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      </div>
    `,
  });
}

/* ===================== COACH APPLICATION ===================== */

export async function sendCoachApplicationNotification({
  email, name, specialty, phone, location
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Coach Application Received - Azroute Chess Institute',
    html: `
      <h2>Hello ${name},</h2>
      <p>We received your coach application.</p>
      <ul>
        <li>Specialty: ${specialty}</li>
        <li>Phone: ${phone}</li>
        <li>Location: ${location}</li>
      </ul>
    `,
  });
}

/* ===================== EMAIL VERIFICATION ===================== */

export async function sendVerificationEmail({
  email, name, token, role, type = 'verify'
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const path = type === 'reset'
    ? `/auth/${role}/reset-password`
    : `/auth/${role}/verify-token`;

  const actionUrl = `${baseUrl}${path}?token=${token}`;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: type === 'reset' ? 'Reset Password' : 'Verify Email',
    html: `
      <h2>Hello ${name},</h2>
      <p>Please click the link below:</p>
      <a href="${actionUrl}">${actionUrl}</a>
    `,
  });
}
