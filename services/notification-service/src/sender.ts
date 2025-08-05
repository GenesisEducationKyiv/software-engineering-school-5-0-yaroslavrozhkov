import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  const info = await transporter.sendMail({
    from: '"Weather Alerts" <noreply@weatherapp.com>',
    to,
    subject,
    text,
  });

  console.log(`✅ [Email] Sent message: ${info.messageId}`);
}
