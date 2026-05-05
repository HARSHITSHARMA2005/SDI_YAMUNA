import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (email, otp) => {
  await resend.emails.send({
    from: 'Yamuna Monitor <onboarding@resend.dev>',
    to: email,
    subject: 'Your OTP — Yamuna Pollution Monitor',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#020d1a;color:#e0f0ff;border-radius:12px;">
        <h2 style="color:#00d4ff;margin-bottom:8px;">Yamuna Pollution Monitor</h2>
        <p style="color:#a0c0e0;margin-bottom:24px;">Use the OTP below to verify your email. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#ffffff;background:#0a2a50;padding:20px;border-radius:8px;text-align:center;">${otp}</div>
        <p style="color:#607080;font-size:12px;margin-top:24px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export default sendOtp;