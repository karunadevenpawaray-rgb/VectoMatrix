// VECTOMATRIX NOTIFICATIONS ARCHITECTURE
// This file serves as the blueprint for integrating Twilio (SMS) and Resend (Email).



/**
 * Sends a notification SMS to the vendor when a new lead is generated.
 * Designed to be called either from the Frontend (Edge Function) or directly via API Route.
 */
export async function sendVendorSmsAlert(phone: string, clientName: string, packageTitle: string) {
  // --- PREPARED TWILIO API CALL ---
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
}

/**
 * Sends a confirmation email to the consumer with their itinerary PDF.
 */
export async function sendConsumerEmailReceipt(email: string, clientName: string, bookingRef: string) {
  // --- PREPARED RESEND API CALL ---
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
}
