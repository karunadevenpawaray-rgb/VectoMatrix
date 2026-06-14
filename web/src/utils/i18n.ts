// Lightweight Custom Mock i18n Implementation

export type Locale = 'en' | 'fr' | 'ar';

export const mockTranslations = {
  en: {
    greeting: "Hello, Traveler!",
    search: "Search Packages",
    bookNow: "Book Now",
    price: "Price per person",
    myTrips: "My Trips",
    offlineSync: "Sync Now"
  },
  fr: {
    greeting: "Bonjour, Voyageur!",
    search: "Rechercher des forfaits",
    bookNow: "Réserver",
    price: "Prix par personne",
    myTrips: "Mes Voyages",
    offlineSync: "Synchroniser"
  },
  ar: {
    greeting: "مرحبًا أيها المسافر!",
    search: "بحث عن حزم",
    bookNow: "احجز الآن",
    price: "السعر للشخص الواحد",
    myTrips: "رحلاتي",
    offlineSync: "مزامنة الآن"
  }
};

export function getTranslation(locale: Locale, key: keyof typeof mockTranslations['en']) {
  return mockTranslations[locale][key] || mockTranslations['en'][key];
}

export function isRTL(locale: Locale) {
  return locale === 'ar';
}
