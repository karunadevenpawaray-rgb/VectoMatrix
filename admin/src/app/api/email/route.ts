import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/utils/supabase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

export async function POST(request: Request) {
  try {
    const { agencyId, type, variables, toEmail } = await request.json();

    if (!agencyId || !type || !toEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (USE_MOCK_DATA) {
      console.log(`\n[MOCK EMAIL SERVER]`);
      console.log(`Intercepted outgoing email for agency: ${agencyId}`);
      console.log(`Type: ${type} | To: ${toEmail}`);
      console.log(`Variables:`, variables);
      console.log(`(Email was not actually sent. Set USE_MOCK_DATA = false to use real SMTP.)\n`);
      return NextResponse.json({ success: true, mock: true });
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
