import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/utils/supabase';


// Simple in-memory rate limiting map: key -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // max 5 emails per minute per agency

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const activeTimestamps = timestamps.filter(t => now - t < LIMIT_WINDOW_MS);
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  activeTimestamps.push(now);
  rateLimitMap.set(key, activeTimestamps);
  return false;
}

/* Original code:
export async function POST(request: Request) {
  try {
    const { agencyId, type, variables, toEmail } = await request.json();

    if (!agencyId || !type || !toEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
*/

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token format' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Session is invalid' }, { status: 401 });
    }

    const { agencyId, type, variables, toEmail } = await request.json();

    if (!agencyId || !type || !toEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isRateLimited(agencyId)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { data: agencyUser, error: agencyError } = await supabase
      .from('agencies')
      .select('id')
      .eq('id', agencyId)
      .eq('auth_id', user.id)
      .single();

    if (agencyError || !agencyUser) {
      return NextResponse.json({ error: 'Forbidden: User does not belong to the specified agency' }, { status: 403 });
    }


    // --- LIVE SMTP DELIVERY ---
    // 1. Fetch agency's SMTP settings and templates
    const { data: settings, error } = await supabase
      .from('agency_settings')
      .select('*')
      .eq('agency_id', agencyId)
      .single();

    if (error || !settings) {
      return NextResponse.json({ error: 'Agency SMTP settings not found' }, { status: 404 });
    }

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      return NextResponse.json({ error: 'Incomplete SMTP configuration' }, { status: 400 });
    }

    // 2. Select the right template based on the type
    let htmlTemplate = '';
    let subject = '';

    if (type === 'LEAD_RECEIVED') {
      htmlTemplate = settings.template_lead_received || '<p>New lead received from {{client_name}}.</p>';
      subject = `New Lead Received: ${variables.client_name || 'Inquiry'}`;
    } else if (type === 'LEAD_CONVERTED') {
      htmlTemplate = settings.template_lead_converted || '<p>Your booking is confirmed, {{client_name}}.</p>';
      subject = `Booking Confirmation - ${variables.package_title || 'Your Trip'}`;
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // 3. Compile the template (replace variables)
    // Simple bracket replacement: {{variable_name}}
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlTemplate = htmlTemplate.replace(regex, String(value));
    }

    // 4. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port || 587,
      secure: settings.smtp_port === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      },
    });

    // 5. Send Mail
    const info = await transporter.sendMail({
      from: `"${settings.smtp_from_name || 'Travel Agency'}" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: toEmail,
      subject: subject,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Email Delivery Error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
