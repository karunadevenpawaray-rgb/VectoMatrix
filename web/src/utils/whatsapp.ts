interface WhatsAppPayload {
  agencyPhone: string; // Must be E.164 format without the '+'
  packageTitle: string;
  packageId: string;
  agencyName: string;
  passengerCount: number;
  selectedTier: string;
  includeEsim: boolean;
  privateCarUpgrade: boolean;
  calculatedTotalMur: number;
}

export function generateWhatsAppLink(payload: WhatsAppPayload): string {
  // Strip the '+' sign if present in the database E.164 format string
  const cleanPhone = payload.agencyPhone.replace('+', '');

  const text = `Hi True Memories Travel & Tours! I am looking at ${payload.packageTitle} (Ref: ${payload.packageId}) by ${payload.agencyName}. I want to travel with ${payload.passengerCount} passengers. My selected options are: Insurance: ${payload.selectedTier}, eSIM: ${payload.includeEsim ? 'Yes' : 'No'}, Private Car Upgrade: ${payload.privateCarUpgrade ? 'Yes' : 'No'}. My estimated total is ${payload.calculatedTotalMur} MUR. Please confirm availability.`;

  const encodedText = encodeURIComponent(text);
  
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
