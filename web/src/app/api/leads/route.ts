import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Assuming Resend SDK is installed. If not, you will need to `npm install resend`
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      packageId, 
      assignedAgencyId, 
      clientName, 
      clientEmail, 
      clientPhone, 
      passengerCount, 
      selectedInsurance, 
      includeEsim, 
      upgradePrivateCar, 
      calculatedTotalMur,
      // Security fields
      honeypotField,
      turnstileToken 
    } = body;

    // 1. HONEYPOT VALIDATION
    // If the hidden honeypot field is filled, it's a bot.
    if (honeypotField && honeypotField.length > 0) {
      console.warn("Honeypot triggered.");
      return NextResponse.json({ error: "Invalid request submission." }, { status: 400 });
    }

    // 2. TURNSTILE VALIDATION
    if (!turnstileToken) {
      return NextResponse.json({ error: "Missing Turnstile verification." }, { status: 400 });
    }
    
    const turnstileFormData = new URLSearchParams();
    turnstileFormData.append('secret', TURNSTILE_SECRET);
    turnstileFormData.append('response', turnstileToken);

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData
    });
    const turnstileData = await turnstileResult.json();

    if (!turnstileData.success) {
      return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
    }

    // 3. DATABASE INGESTION
    // We insert the lead using the server-side client (could use Service Role key for backend inserts if needed, 
    // but anon is fine since RLS policy "Anyone can insert a lead" is active).
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        package_id: packageId,
        assigned_agency_id: assignedAgencyId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        passenger_count: passengerCount,
        selected_insurance: selectedInsurance,
        include_esim: includeEsim,
        upgrade_private_car: upgradePrivateCar,
        calculated_total_mur: calculatedTotalMur,
        status: 'PENDING'
      })
      .select()
      .single();

    if (leadError) {
      console.error("Supabase Error:", leadError);
      return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
    }

    // 4. RESEND EMAIL DESPATCH
    // Fetch agency details to get their email
    const { data: agencyData } = await supabase
      .from('agencies')
      .select('email, name')
      .eq('id', assignedAgencyId)
      .single();

    if (agencyData && agencyData.email) {
      await resend.emails.send({
        from: 'leads@vectomatrix.mu',
        to: agencyData.email,
        subject: `New Lead: ${clientName} - VectoMatrix`,
        html: `
          <h2>New Package Inquiry</h2>
          <p><strong>Client Name:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Phone:</strong> ${clientPhone}</p>
          <hr />
          <h3>Package Details</h3>
          <p><strong>Passengers:</strong> ${passengerCount}</p>
          <p><strong>Insurance:</strong> ${selectedInsurance}</p>
          <p><strong>Include eSIM:</strong> ${includeEsim ? 'Yes' : 'No'}</p>
          <p><strong>Private Car:</strong> ${upgradePrivateCar ? 'Yes' : 'No'}</p>
          <p><strong>Calculated Total:</strong> Rs ${calculatedTotalMur}</p>
          <br/>
          <p>Please review this lead in your VectoMatrix Vendor Portal.</p>
        `
      });
    }

    return NextResponse.json({ success: true, leadId: leadData.id });

  } catch (error) {
    console.error("Endpoint Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
