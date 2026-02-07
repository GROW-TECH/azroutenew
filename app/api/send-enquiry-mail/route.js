export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, phone, age, location, message } = body;

    if (!name || !email || !phone) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const subject = "New Student Enquiry from Website";

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <p>Dear Azroute Academy Team,</p>

        <p>You have received a new enquiry from the chess academy website contact form.</p>

        <p><b>Student Details:</b></p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Phone:</b> ${phone}</li>
          <li><b>Age:</b> ${age || "-"}</li>
          <li><b>Location:</b> ${location || "-"}</li>
        </ul>

        <p><b>Message:</b><br/>${message || "-"}</p>

        <p>Please follow up with the student at the earliest.</p>

        <p>
        Regards,<br/>
        Website Enquiry System<br/>
        Azroute Academy
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,                 // FROM = Azroute mail
      to: process.env.AZROUTE_ADMIN_EMAIL,         // TO = Azroute mail only
      replyTo: email,                              // Reply = student mail
      subject,
      html,
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
