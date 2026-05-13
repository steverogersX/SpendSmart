import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { config } from '../config/env';
import { logger } from '../config/logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Lazy singletons — created once, reused across requests
let _transporter: nodemailer.Transporter | null = null;
let _resend: Resend | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      ignoreTLS: true,
    });
  }
  return _transporter;
}

function getResend(): Resend {
  if (!_resend) _resend = new Resend(config.RESEND_API_KEY);
  return _resend;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  if (config.NODE_ENV === 'development') {
    const info = await getTransporter().sendMail({
      from: config.RESEND_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    logger.info({ messageId: info.messageId, to: opts.to }, 'dev email → MailDev');
  } else 
    {
    const { data, error } = await getResend().emails.send({
      from: config.RESEND_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) throw new Error(`Resend error: ${error.message}`);
    logger.info({ id: data?.id, to: opts.to }, 'email sent via Resend');
  }
}
