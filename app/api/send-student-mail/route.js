// app/api/send-student-mail/route.js
export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return Response.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { studentEmail, studentData, report } = body;

    if (!studentEmail) {
      return Response.json(
        { success: false, message: "studentEmail missing" },
        { status: 400 }
      );
    }

    if (!studentData) {
      return Response.json(
        { success: false, message: "studentData missing" },
        { status: 400 }
      );
    }

    if (!report) {
      return Response.json(
        { success: false, message: "report missing" },
        { status: 400 }
      );
    }

    // ===============================
    // Normalize Report Data
    // ===============================
    const screeningType =
      report.screeningType || report.screening_type || "Screening";

    const score = Number(report.score ?? 0);
    const totalQuestions = Number(
      report.totalQuestions ?? report.total_questions ?? 0
    );

    const percentage =
      report.percentage ??
      (totalQuestions ? ((score / totalQuestions) * 100).toFixed(1) : "0");

    const level = report.level || "N/A";

    const recommendation =
      report.recommendation || "Our team will contact you shortly.";

    const dateStr = report.completedAt
      ? new Date(report.completedAt).toLocaleDateString()
      : new Date().toLocaleDateString();

    const subject = "Screening Report - Your Assessment Results";

    // ===============================
    // EMAIL TEMPLATE (Exact Screenshot Style)
    // ===============================
    const html = `
<div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
  <h2 style="margin-bottom:10px;">Screening Report</h2>

  <div style="
      background:#f3f4f6;
      padding:20px;
      border-radius:12px;
      border:1px solid #e5e7eb;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      white-space: pre-wrap;
      line-height:1.6;
  ">
AZROUTE CHESS INSTITUTE - SCREENING REPORT
==========================================

Student Name : ${escapeHtml(studentData.studentName || "-")}
Screening Type : ${escapeHtml(screeningType)}
Date : ${escapeHtml(dateStr)}

RESULTS:
--------
Score : ${score}/${totalQuestions}
Percentage : ${escapeHtml(String(percentage))}%
Level : ${escapeHtml(level)}

RECOMMENDATION:
---------------
${escapeHtml(recommendation)}

NEXT STEPS:
-----------
1. Our team will contact you within 24 hours
2. Personal consultation with our team
3. Customized program recommendation
4. Flexible scheduling options
  </div>

  <p style="margin-top:20px;">
    Our team will contact you shortly for further guidance.
  </p>

  <p style="font-size:12px;color:#666;margin-top:20px;">
    AZRoute Chess Institute
  </p>
</div>
`;

    // ======================================================
    // SMTP (GMAIL)
    // ======================================================
    const host = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
    const port = Number(process.env.EMAIL_SERVER_PORT || 587);
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD;

    // ✅ This decides the "From" shown in mail
    // Keep EMAIL_FROM like: "Azroute Academy <nivethagslakshmi@gmail.com>"
    const from = process.env.EMAIL_FROM || `Azroute Academy <${user}>`;

    // ✅ send ONLY to AZRoute admin mail (not student)
    // Put this in .env.local => AZROUTE_ADMIN_EMAIL=nivethagslakshmi@gmail.com
    const to = process.env.AZROUTE_ADMIN_EMAIL || user;

    if (!user || !pass) {
      return Response.json(
        {
          success: false,
          message:
            "SMTP credentials missing. Set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD",
        },
        { status: 500 }
      );
    }

    // ✅ IMPORTANT: 587 => secure false, 465 => secure true
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();

    await transporter.sendMail({
      from,           // ✅ From name/email you want
      to,             // ✅ Always Azroute admin mail
      replyTo: studentEmail, // ✅ When you click reply, it will go to student
      subject,
      html,
    });

    return Response.json({ success: true, provider: "smtp" });
  } catch (err) {
    console.error("SEND MAIL ERROR:", err);
    return Response.json(
      { success: false, message: err?.message || "Email failed" },
      { status: 500 }
    );
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
