import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { supabase } from '@/lib/supabaseClient';
import { supabase } from '@/utils/supabase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId, agencyId, clientName, clientEmail, clientPhone, totalAmount } = body;

    if (USE_MOCK_DATA) {
      console.log(`\n[MOCK STRIPE CHECKOUT]`);
      console.log(`Intercepted checkout for package: ${packageId}`);
      console.log(`Client: ${clientName} | Total: Rs ${totalAmount}`);
      console.log(`(Checkout session was not created. Set USE_MOCK_DATA = false to use live Stripe.)\n`);
      return NextResponse.json({ url: `/checkout?success=mock` });
    }

    // --- LIVE STRIPE CHECKOUT ---
    
    // 1. First, create a pending lead in Supabase so we have an ID to pass to Stripe
    const { data: leadData, error: leadError } = await supabase.from('leads').insert({
      package_id: packageId,
      assigned_agency_id: agencyId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      calculated_total_mur: totalAmount,
      status: 'PENDING',
      payment_status: 'UNPAID'
    }).select().single();

    if (leadError) {
      throw new Error("Failed to create pending lead: " + leadError.message);
    }

    // 2. Fetch package details for the line item
    const { data: pkgData } = await supabase.from('packages').select('title').eq('id', packageId).single();

    // 3. Create Stripe Checkout Session
    // We pass the lead.id in the metadata so our future Stripe Webhook knows which lead to mark as PAID and CONVERTED.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mur',
            product_data: {
              name: pkgData?.title || 'Travel Package Booking',
              description: `Booking for ${clientName}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Stripe expects cents/smallest currency unit
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      metadata: {
        lead_id: leadData.id
      }
    });

    // 4. Update the lead with the Stripe session ID
    await supabase.from('leads').update({ stripe_session_id: session.id }).eq('id', leadData.id);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
