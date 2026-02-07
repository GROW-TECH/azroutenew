import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { studentEmail, studentName, report } = await req.json();

    await resend.emails.send({
      from: 'AZRoute Chess <noreply@azroutechess.com>',
      to: studentEmail,
      subject: 'Your Screening Report',
      html: `
        <h2>Hi ${studentName}</h2>
        <p>Your screening completed.</p>
        <p><b>Score:</b> ${report.score}/${report.totalQuestions}</p>
        <p><b>Level:</b> ${report.level}</p>
        <p>${report.recommendation}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
