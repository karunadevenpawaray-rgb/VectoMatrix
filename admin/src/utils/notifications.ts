// VECTOMATRIX NOTIFICATIONS ARCHITECTURE
// This file serves as the blueprint for integrating Twilio (SMS) and Resend (Email).

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

/**
 * Sends a notification SMS to the vendor when a new lead is generated.
 * Designed to be called either from the Frontend (Edge Function) or directly via API Route.
 */
export async function sendVendorSmsAlert(phone: string, clientName: string, packageTitle: string) {
  if (USE_MOCK_DATA) {
    console.log(`[MOCK SMS TO ${phone}]: You have a new lead from ${clientName} for ${packageTitle}. Log in to VectoMatrix B2B to view details.`);
    return { success: true, method: 'mock' };
  }

  // --- PREPARED TWILIO API CALL ---
  /*
  try {
    const response = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, clientName, packageTitle })
    });
    return await response.json();
  } catch (error) {
    console.error("SMS Failed", error);
    return { success: false, error };
  }
  */
}

/**
 * Sends a confirmation email to the consumer with their itinerary PDF.
 */
export async function sendConsumerEmailReceipt(email: string, clientName: string, bookingRef: string) {
  if (USE_MOCK_DATA) {
    console.log(`[MOCK EMAIL TO ${email}]: Dear ${clientName}, your booking ${bookingRef} is confirmed. Attached: Itinerary.pdf`);
    return { success: true, method: 'mock' };
  }

  // --- PREPARED RESEND API CALL ---
  /*
  try {
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, clientName, bookingRef })
    });
    return await response.json();
  } catch (error) {
    console.error("Email Failed", error);
    return { success: false, error };
  }
  */
}
