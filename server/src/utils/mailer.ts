import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const service = process.env.SMTP_SERVICE; // e.g. 'gmail'

  if (service || (host && user && pass)) {
    transporter = nodemailer.createTransport(
      service
        ? {
            service,
            auth: { user, pass },
          }
        : {
            host,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user, pass },
          }
    );
    return transporter;
  }

  return null;
};

export const sendVerificationEmail = async (
  email: string,
  code: string,
  purpose: 'login' | 'signup' = 'login'
): Promise<{ sent: boolean; isDev?: boolean }> => {
  const mailTransporter = getTransporter();
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || '"SWAPIC" <noreply@swapic.in>';

  const subject =
    purpose === 'signup'
      ? `Verify your email for Swapic — Code: ${code}`
      : `Your Swapic Sign-in Code: ${code}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF7F2; margin: 0; padding: 24px; color: #35190F; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 36px 32px; border: 1px solid #EDE8E1; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .brand { font-size: 20px; font-weight: 800; color: #35190F; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .title { font-size: 22px; font-weight: 700; color: #35190F; margin: 0 0 10px 0; }
        .desc { font-size: 14.5px; line-height: 1.5; color: #654332; margin: 0 0 24px 0; }
        .code-box { background: #FFF4EC; border: 1.5px dashed #E96B16; border-radius: 14px; padding: 18px; text-align: center; margin: 24px 0; }
        .code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #E96B16; font-family: monospace; }
        .notice { font-size: 13px; color: #8C6E5D; margin-top: 20px; line-height: 1.4; }
        .footer { text-align: center; font-size: 12px; color: #A69285; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">SWAPIC</div>
        <h1 class="title">${purpose === 'signup' ? 'Verify your new account' : 'Confirm your sign in'}</h1>
        <p class="desc">
          Enter this verification code in the Swapic app to confirm that <strong>${email}</strong> belongs to you.
        </p>
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        <p class="notice">
          This code is valid for <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Swapic · A Kinder Marketplace
      </div>
    </body>
    </html>
  `;

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from,
        to: email,
        subject,
        html,
        text: `Your Swapic verification code is: ${code}. Valid for 10 minutes.`,
      });
      console.log(`✉️ Email successfully dispatched to ${email}`);
      return { sent: true };
    } catch (err: any) {
      console.error(`❌ Failed to send email via SMTP to ${email}:`, err.message);
      // Fallback: log to console so developer/user is not locked out
      console.log(`\n========================================\n🔑 [SWAPIC DEV CODE] Email: ${email}\n👉 OTP: ${code}\n========================================\n`);
      return { sent: true, isDev: true };
    }
  } else {
    // If SMTP credentials not configured yet, log prominently to terminal for dev testing
    console.log(`\n========================================\n🔑 [SWAPIC VERIFICATION CODE]\nEmail: ${email}\n👉 CODE: ${code}\n(Configure SMTP_USER & SMTP_PASS in server/.env for live email delivery)\n========================================\n`);
    return { sent: true, isDev: true };
  }
};
