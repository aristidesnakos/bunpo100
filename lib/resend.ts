import fs from 'fs/promises';
import path from 'path';
import { Resend } from 'resend';
import config from "@/config";

// Initialize Resend with your API key only if the key is available
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else if (process.env.NODE_ENV === "development") {
  console.group("⚠️ RESEND_API_KEY missing from .env");
  console.error("It's required to send emails.");
  console.error("If you don't need it, remove the code from /libs/resend.ts");
  console.groupEnd();
}

async function loadTemplate(templateName: string): Promise<string> {
  const possiblePaths = [
    path.join(process.cwd(), 'lib', 'emails', 'stripe', `${templateName}.html`),
    path.join(process.cwd(), 'lib', 'emails', 'templates', `${templateName}.html`),
    templateName.includes('/') ? path.join(process.cwd(), 'lib', 'emails', `${templateName}.html`) : null,
  ].filter(Boolean) as string[];

  for (const templatePath of possiblePaths) {
    try {
      return await fs.readFile(templatePath, 'utf-8');
    } catch {
      continue;
    }
  }

  throw new Error(`Failed to load email template: ${templateName}`);
}

function replaceVariables(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce((acc, [key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    return acc.replace(regex, value);
  }, template);
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}): Promise<any> => {
  if (!resend) {
    console.warn('Resend service not available. Skipping email send.');
    return { id: 'mock-email-id', message: 'Email sending disabled (no API key)' };
  }

  const data = {
    from: config.resend.fromAdmin,
    to: [to],
    subject,
    text,
    html,
    reply_to: replyTo,
  };

  const { data: result, error } = await resend.emails.send(data);

  if (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }

  return result;
};

export const sendSubConfirmEmail = async ({
  to,
  subject,
  htmlTemplate,
  replyTo,
  emailVariables,
}: {
  to: string;
  subject: string;
  htmlTemplate: string;
  replyTo: string;
  emailVariables: Record<string, string | string[] | number>;
}): Promise<any> => {
  if (!resend) {
    console.warn('Resend service not available. Skipping subscription confirmation email.');
    return { id: 'mock-sub-confirm-id', message: 'Email sending disabled (no API key)' };
  }

  let template = await loadTemplate(htmlTemplate);

  emailVariables.logo_url = `${process.env.NEXT_PUBLIC_BASE_URL}/app/icon.png`;

  const processedVariables = Object.entries(emailVariables).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map(item => `<li>${item}</li>`).join('\n');
    } else if (typeof value === 'number') {
      acc[key] = value.toString();
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const html = replaceVariables(template, processedVariables);

  return sendEmail({ to, subject, html, replyTo });
};
