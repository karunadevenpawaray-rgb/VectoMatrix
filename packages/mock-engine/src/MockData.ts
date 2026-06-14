const vividImages: Record<string, string[]> = {
  "DUBAI": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=800"
  ],
  "MALAYSIA": [
    "https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1541355480521-1ce6685820cc?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1548680072-00fc4da677c7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1603525281577-ab558e0a297e?auto=format&fit=crop&q=80&w=800"
  ],
  "MALDIVES": [
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1605635833443-02f43bb609b5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=800"
  ],
  "SOUTH_AFRICA": [
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522049380963-14dbfbf138be?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1550586678-f71f112e84c9?auto=format&fit=crop&q=80&w=800"
  ],
  "RODRIGUES": [
    "https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1620023602934-85514f0896fa?auto=format&fit=crop&q=80&w=800"
  ],
  "REUNION": [
    "https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1533052865963-305739097746?auto=format&fit=crop&q=80&w=800"
  ]
};

const getItineraryDays = (dest: string) => {
  if (dest === "SOUTH_AFRICA") {
    return [
      { day: 1, title: "Arrive Airport, Meet & Greet by our representative", description: "" },
      { day: 2, title: "Guided Cape Town City Tour including city highlights, historic areas, and scenic coastal drives + Visit to Table Mountain (weather permitting) and exploration of Bo-Kaap and city centre.", description: "" },
      { day: 3, title: "Free for leisure", description: "" },
      { day: 4, title: "Cape Peninsula Full Day Tour / Full-day Cape Peninsula Tour including:", description: "- Seal Island Boat Trip at Seal Island\n- Scenic drive via Chapman's Peak Drive\n- Visit to Cape Point (Funicular Included)\n- Visit to Boulders Beach" },
      { day: 5, title: "Free for leisure", description: "" },
      { day: 6, title: "Free for leisure", description: "" },
      { day: 7, title: "Free for leisure", description: "" },
      { day: 8, title: "Departure from Cape Town to Mauritius.", description: "" }
    ];
  }
  if (dest === "DUBAI") {
    return [
      { day: 1, title: "Arrival in Dubai", description: "Airport transfer to Atlantis The Palm. Evening at leisure." },
      { day: 2, title: "Desert Safari", description: "Afternoon dune bashing, camel riding, and BBQ dinner." },
      { day: 3, title: "City Tour", description: "Visit Burj Khalifa and Dubai Mall." }
    ];
  }
  return [
    { day: 1, title: "Arrival & Hotel Check-in", description: "Arrive and transfer to your luxury resort. Relax and unwind." },
    { day: 2, title: "Exploring the Destination", description: "Enjoy local sights, beaches, and scenic tours." },
    { day: 3, title: "Leisure & Shopping", description: "Free day for personal exploration, shopping, or relaxing at the resort." },
    { day: 4, title: "Departure", description: "Transfer to airport for flight back home." }
  ];
};

export const generatedPackages = Array.from({ length: 34 }, (_, i) => {
  const dest = ["DUBAI", "MALAYSIA", "MALDIVES", "SOUTH_AFRICA", "RODRIGUES", "REUNION"][i % 6];
  const imagesForDest = vividImages[dest];
  
  // Rotate the array so the hero image is different for each package in the same destination
  const rotatedImages = [...imagesForDest];
  for (let j = 0; j < (i % imagesForDest.length); j++) {
    rotatedImages.push(rotatedImages.shift()!);
  }

  return {
    id: `pkg-${i + 4}`,
    service_type: i % 3 === 0 ? "hotel" : "package",
    agency_id: i % 2 === 0 ? "agency-alpha" : "agency-beta",
    title: `Premium Travel Experience ${i + 4}`,
    destination: dest,
    base_price_mur: 15000 + (i * 1500),
    service_fee: 10,
    travel_month: "2026-08",
    hotel_name: `Luxury Resort ${i}`,
    hotel_stars: (i % 3) + 3,
    description: `A wonderful trip designed for you. Experience the best of ${dest}.`,
    is_active: true,
    is_archived: false,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    gallery_images: rotatedImages,
    itinerary_days: getItineraryDays(dest),
    occupancy_pricing: {
      adult: 15000 + (i * 1500),
      teen: 12000,
      child: 8000,
      infant: 0
    },
    reviews: []
  };
});

export const initialPackages = [
  {
    id: "pkg-1",
    service_type: "package",
    agency_id: "agency-alpha",
    title: "5 Days Dubai Premium Desert Safari",
    destination: "DUBAI",
    base_price_mur: 45000, // Base per adult for packages
    service_fee: 10, // 10% markup
    travel_month: "2026-08",
    hotel_name: "Atlantis The Palm",
    hotel_stars: 5,
    description: "Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars.",
    is_active: true,
    is_archived: false,
    created_at: "2026-06-11T10:00:00Z",
    gallery_images: [
      "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=800"
    ],
    itinerary_days: [
      { day: 1, title: "Arrival in Dubai", description: "Airport transfer to Atlantis The Palm. Evening at leisure." },
      { day: 2, title: "Desert Safari", description: "Afternoon dune bashing, camel riding, and BBQ dinner." },
      { day: 3, title: "City Tour", description: "Visit Burj Khalifa and Dubai Mall." }
    ],
    occupancy_pricing: {
      adult: 45000,
      teen: 38000,
      child: 25000,
      infant: 0
    },
    reviews: [
      { author: "John D.", rating: 5, comment: "Amazing experience, perfectly organized!" },
      { author: "Sarah M.", rating: 4, comment: "Great hotel, though the safari was quite hot." }
    ]
  },
  {
    id: "pkg-2",
    service_type: "activity",
    agency_id: "agency-beta",
    title: "Kuala Lumpur Shopping Fiesta",
    destination: "MALAYSIA",
    base_price_mur: 5000,
    service_fee: 15, // 15% markup
    travel_month: "2026-09",
    description: "Shop till you drop in the heart of Kuala Lumpur. Guided shopping tour.",
    duration_hours: 6,
    pickup_locations: ["KLCC", "Pavilion", "Central Market"],
    is_active: true,
    is_archived: false,
    created_at: "2026-06-11T12:00:00Z",
    gallery_images: [
      "https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541355480521-1ce6685820cc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1548680072-00fc4da677c7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603525281577-ab558e0a297e?auto=format&fit=crop&q=80&w=800"
    ],
    occupancy_pricing: {
      adult: 5000,
      teen: 5000,
      child: 2500,
      infant: 0
    },
    reviews: []
  },
  {
    id: "pkg-3",
    service_type: "hotel",
    agency_id: "agency-alpha",
    title: "Kurumba Maldives Resort",
    destination: "MALDIVES",
    base_price_mur: 85000, // Acts as the flat Room price if needed
    service_fee: 8, // 8% markup
    travel_month: "2026-10",
    hotel_name: "Kurumba Maldives",
    hotel_stars: 5,
    description: "Watch the sunset over the lagoon, walk down sandy beaches, and relax in beachfront villas.",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    gallery_images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605635833443-02f43bb609b5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=800"
    ],
    room_types: [
      { id: "rt-1", name: "Beach Villa", max_occupancy: 2 },
      { id: "rt-2", name: "Overwater Bungalow", max_occupancy: 3, service_fee: 12 } // Room-level override
    ],
    occupancy_pricing: {
      adult: 85000,  // Base flat per-night for the room (includes 2 adults typically, but let's say it's per adult per night)
      teen: 15000,   // Supplement for teen
      child: 8000,   // Supplement for child
      infant: 0      // Free
    },
    meal_plans: ["Bed & Breakfast", "Half Board", "Full Board"]
  },
  ...generatedPackages
];

const generatedLeads = Array.from({ length: 30 }, (_, i) => ({
  id: `lead-${i + 3}`,
  package_id: `pkg-${(i % 30) + 1}`,
  assigned_agency_id: i % 2 === 0 ? "agency-alpha" : "agency-beta",
  client_name: `Client Name ${i}`,
  client_email: `client${i}@example.com`,
  client_phone: `+230 5555 00${i}`,
  passenger_count: (i % 4) + 1,
  selected_insurance: i % 2 === 0 ? "Premium SWAN Cover" : "Standard Cover",
  include_esim: i % 2 === 0,
  upgrade_private_car: i % 3 === 0,
  calculated_total_mur: 20000 + (i * 2000),
  status: ["PENDING", "CONVERTED", "LOST"][i % 3],
  payment_status: ["UNPAID", "PAID"][i % 2],
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  package: { title: `Premium Travel Experience ${(i % 30) + 1}` }
}));

export const initialLeads = [
  {
    id: "lead-1",
    package_id: "pkg-1",
    assigned_agency_id: "agency-alpha",
    client_name: "Jean Dupont",
    client_email: "jean@example.com",
    client_phone: "+230 5555 1234",
    passenger_count: 2,
    selected_insurance: "Premium SWAN Cover",
    include_esim: true,
    upgrade_private_car: false,
    calculated_total_mur: 45000,
    status: "PENDING",
    payment_status: "UNPAID",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    package: { title: "5 Days Dubai Premium Desert Safari" }
  },
  {
    id: "lead-2",
    package_id: "pkg-2",
    assigned_agency_id: "agency-beta",
    client_name: "Sarah Lee",
    client_email: "sarah@example.com",
    client_phone: "+230 5555 9876",
    passenger_count: 1,
    selected_insurance: "Standard Cover",
    include_esim: false,
    upgrade_private_car: true,
    calculated_total_mur: 32000,
    status: "CONVERTED",
    payment_status: "PAID",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    package: { title: "Kuala Lumpur Shopping Fiesta" }
  },
  ...generatedLeads
];

const generatedAgencies = Array.from({ length: 27 }, (_, i) => ({
  id: `agency-${i + 3}`,
  name: `Travel Agency ${i + 3}`,
  status: ["Active", "Inactive"][i % 2],
  joined: new Date(Date.now() - i * 86400000 * 30).toISOString().split('T')[0]
}));

export const initialAgencies = [
  {
    id: "agency-alpha",
    name: "Alpha Travels",
    status: "Active",
    joined: "2026-01-15"
  },
  {
    id: "agency-beta",
    name: "Beta Tours",
    status: "Active",
    joined: "2026-03-22"
  },
  ...generatedAgencies
];

export const defaultMockConfig = {
  latencyMs: 800,
  errorRatePercent: 0, // 0 = no errors, 100 = all requests fail
  offlineMode: false,
};

export const initialBillboards = [
  {
    id: "billboard-1",
    title: "YOUR GATEWAY TO BEAUTIFUL JOURNEYS",
    subtitle: "True Memories Travel & Tours acts as a bridge between traveler and tours and holidays. Explore quiet beachside strolls, guided walks, and simple packages.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    cta_text: "Discover Packages",
    cta_link: "#packages",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "billboard-2",
    title: "5 Days Dubai Premium Desert Safari",
    subtitle: "Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars at Atlantis The Palm.",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
    cta_text: "Book Dubai Now",
    cta_link: "/package/pkg-1",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "billboard-3",
    title: "Kurumba Maldives Resort Special",
    subtitle: "Watch the sunset over the lagoon, walk down sandy beaches, and relax in beachfront villas.",
    image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200",
    cta_text: "View Resort Details",
    cta_link: "/package/pkg-3",
    is_active: true,
    created_at: new Date().toISOString()
  }
];

