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

export const generatedPackages = [
  // ─── DUBAI ───────────────────────────────────────────────────────────
  {
    id: "pkg-4", service_type: "package", agency_id: "agency-alpha",
    title: "7 Nights Dubai Luxury City Break",
    destination: "DUBAI", base_price_mur: 52000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Burj Al Arab", hotel_stars: 5,
    description: "Experience the world's most iconic hotel. Enjoy private beach access, Michelin-starred dining, and a chauffeur-driven Rolls-Royce from the airport.",
    is_active: true, is_archived: false, created_at: "2026-06-01T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 52000, teen: 42000, child: 28000, infant: 0 }, reviews: [{ author: "Priya S.", rating: 5, comment: "Absolutely spectacular. Worth every rupee!" }]
  },
  {
    id: "pkg-5", service_type: "package", agency_id: "agency-beta",
    title: "Dubai Frame & Creek Heritage Tour",
    destination: "DUBAI", base_price_mur: 28000, service_fee: 12,
    travel_month: "2026-10", hotel_name: "Sofitel Downtown Dubai", hotel_stars: 5,
    description: "Walk across the glass-floored Dubai Frame, cruise the historic Creek at sunset, and explore old spice and gold souks with your expert guide.",
    is_active: true, is_archived: false, created_at: "2026-06-02T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1577724893765-2ec9484acfb5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 28000, teen: 22000, child: 14000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-6", service_type: "package", agency_id: "agency-alpha",
    title: "Dubai Thrills: Skydiving & Water Parks",
    destination: "DUBAI", base_price_mur: 38000, service_fee: 10,
    travel_month: "2026-11", hotel_name: "JW Marriott Marquis", hotel_stars: 5,
    description: "Freefall from 13,000 ft over the Palm Jumeirah, race at Yas Marina, and cool off at Wild Wadi Waterpark — the ultimate adrenaline holiday.",
    is_active: true, is_archived: false, created_at: "2026-06-03T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 38000, teen: 32000, child: 20000, infant: 0 }, reviews: [{ author: "Marc L.", rating: 5, comment: "Best trip of my life. Skydiving was unreal!" }]
  },
  {
    id: "pkg-7", service_type: "package", agency_id: "agency-beta",
    title: "Romantic Dubai Honeymoon Escape",
    destination: "DUBAI", base_price_mur: 68000, service_fee: 8,
    travel_month: "2026-12", hotel_name: "One&Only The Palm", hotel_stars: 5,
    description: "Candlelit dinners on a private beach, couples' spa treatments, and a private yacht cruise past the glittering Dubai skyline — romance redefined.",
    is_active: true, is_archived: false, created_at: "2026-06-04T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 68000, teen: 0, child: 0, infant: 0 }, reviews: [{ author: "Sophie & Jean", rating: 5, comment: "Perfect honeymoon. We still talk about it!" }]
  },
  {
    id: "pkg-8", service_type: "package", agency_id: "agency-alpha",
    title: "Dubai Budget Explorer Package",
    destination: "DUBAI", base_price_mur: 19000, service_fee: 15,
    travel_month: "2026-09", hotel_name: "ibis Dubai Al Barsha", hotel_stars: 3,
    description: "See everything Dubai has to offer without breaking the bank. Visit the Dubai Museum, Metro hop to the Mall of the Emirates and JBR beach.",
    is_active: true, is_archived: false, created_at: "2026-06-05T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1577724893765-2ec9484acfb5?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 19000, teen: 15000, child: 10000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-9", service_type: "package", agency_id: "agency-beta",
    title: "Dubai with Abu Dhabi Grand Mosque",
    destination: "DUBAI", base_price_mur: 34000, service_fee: 10,
    travel_month: "2026-08", hotel_name: "Radisson Blu Dubai Canal", hotel_stars: 4,
    description: "Two cities in one holiday — explore Dubai's futuristic skyline then take a day trip to Abu Dhabi to marvel at the world-famous Sheikh Zayed Grand Mosque.",
    is_active: true, is_archived: false, created_at: "2026-06-06T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 34000, teen: 27000, child: 18000, infant: 0 }, reviews: []
  },
  // ─── MALAYSIA ────────────────────────────────────────────────────────
  {
    id: "pkg-10", service_type: "package", agency_id: "agency-alpha",
    title: "Kuala Lumpur & Langkawi Island Combo",
    destination: "MALAYSIA", base_price_mur: 32000, service_fee: 12,
    travel_month: "2026-09", hotel_name: "Shangri-La KL + The Danna Langkawi", hotel_stars: 5,
    description: "Start with 3 nights in buzzing KL — Petronas Towers, Batu Caves, and rooftop bars — then fly to paradise island Langkawi for turquoise seas and white sand.",
    is_active: true, is_archived: false, created_at: "2026-06-07T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1555400038-063f5f1a5cb3?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALAYSIA"), occupancy_pricing: { adult: 32000, teen: 26000, child: 17000, infant: 0 }, reviews: [{ author: "Anita P.", rating: 5, comment: "Langkawi was breathtaking — we loved every moment." }]
  },
  {
    id: "pkg-11", service_type: "package", agency_id: "agency-beta",
    title: "Penang Food & Culture Discovery",
    destination: "MALAYSIA", base_price_mur: 22000, service_fee: 12,
    travel_month: "2026-10", hotel_name: "Eastern & Oriental Hotel Penang", hotel_stars: 5,
    description: "UNESCO-listed George Town, Hawker street food tours, colonial architecture, and weekend markets — Penang is Malaysia's culinary crown jewel.",
    is_active: true, is_archived: false, created_at: "2026-06-08T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1541355480521-1ce6685820cc?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1548680072-00fc4da677c7?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALAYSIA"), occupancy_pricing: { adult: 22000, teen: 18000, child: 12000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-12", service_type: "package", agency_id: "agency-alpha",
    title: "Borneo Rainforest & Orangutan Trek",
    destination: "MALAYSIA", base_price_mur: 42000, service_fee: 10,
    travel_month: "2026-11", hotel_name: "Gaya Island Resort Kota Kinabalu", hotel_stars: 5,
    description: "Trek through one of the world's oldest rainforests, come face-to-face with wild orangutans at Sepilok, and cruise Kinabatangan River for pygmy elephants.",
    is_active: true, is_archived: false, created_at: "2026-06-09T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1603525281577-ab558e0a297e?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALAYSIA"), occupancy_pricing: { adult: 42000, teen: 35000, child: 22000, infant: 0 }, reviews: [{ author: "David K.", rating: 5, comment: "Seeing orangutans in the wild was life-changing." }]
  },
  {
    id: "pkg-13", service_type: "package", agency_id: "agency-beta",
    title: "Malaysia Family Fun Package",
    destination: "MALAYSIA", base_price_mur: 18000, service_fee: 15,
    travel_month: "2026-09", hotel_name: "Sunway Lagoon Resort", hotel_stars: 4,
    description: "Sunway Lagoon theme park, KL Tower observation deck, Aquaria KLCC, and Legoland Malaysia — perfect for families with children of all ages.",
    is_active: true, is_archived: false, created_at: "2026-06-10T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1555400038-063f5f1a5cb3?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1548680072-00fc4da677c7?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALAYSIA"), occupancy_pricing: { adult: 18000, teen: 14000, child: 9000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-14", service_type: "package", agency_id: "agency-alpha",
    title: "Cameron Highlands Tea Estate Retreat",
    destination: "MALAYSIA", base_price_mur: 16000, service_fee: 12,
    travel_month: "2026-10", hotel_name: "The Smokehouse Hotel Cameron Highlands", hotel_stars: 4,
    description: "Cool mountain air, rolling green tea plantations, strawberry farms, and misty hiking trails. The perfect escape from tropical heat.",
    is_active: true, is_archived: false, created_at: "2026-06-11T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1603525281577-ab558e0a297e?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALAYSIA"), occupancy_pricing: { adult: 16000, teen: 13000, child: 8000, infant: 0 }, reviews: []
  },
  // ─── SOUTH AFRICA ────────────────────────────────────────────────────
  {
    id: "pkg-15", service_type: "package", agency_id: "agency-alpha",
    title: "Cape Town & Garden Route Classic",
    destination: "SOUTH_AFRICA", base_price_mur: 58000, service_fee: 10,
    travel_month: "2026-10", hotel_name: "Cape Grace Hotel", hotel_stars: 5,
    description: "Table Mountain cable car, Cape Point, boulders penguin colony, and a scenic self-drive along the Garden Route from Knysna to Tsitsikamma — pure South Africa.",
    is_active: true, is_archived: false, created_at: "2026-06-12T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1531804226-23eb1b1cddbe?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("SOUTH_AFRICA"), occupancy_pricing: { adult: 58000, teen: 46000, child: 30000, infant: 0 }, reviews: [{ author: "Caroline M.", rating: 5, comment: "South Africa took our breath away. Superb organisation!" }]
  },
  {
    id: "pkg-16", service_type: "package", agency_id: "agency-beta",
    title: "Kruger National Park Safari Adventure",
    destination: "SOUTH_AFRICA", base_price_mur: 75000, service_fee: 8,
    travel_month: "2026-09", hotel_name: "Singita Boulders Lodge", hotel_stars: 5,
    description: "Twice-daily game drives in open 4x4 vehicles through Africa's most famous safari park. Spot the Big Five — lion, leopard, elephant, rhino, and buffalo.",
    is_active: true, is_archived: false, created_at: "2026-06-13T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("SOUTH_AFRICA"), occupancy_pricing: { adult: 75000, teen: 60000, child: 0, infant: 0 }, reviews: [{ author: "Thomas N.", rating: 5, comment: "Saw all Big Five on day 2. Simply incredible!" }]
  },
  {
    id: "pkg-17", service_type: "package", agency_id: "agency-alpha",
    title: "Cape Winelands & Whale Watching",
    destination: "SOUTH_AFRICA", base_price_mur: 48000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Babylonstoren Wine Farm", hotel_stars: 5,
    description: "Sample award-winning wines in Stellenbosch and Franschhoek, then head to Hermanus to watch Southern Right Whales breach just metres from the cliff path.",
    is_active: true, is_archived: false, created_at: "2026-06-14T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1531804226-23eb1b1cddbe?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1522049380963-14dbfbf138be?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("SOUTH_AFRICA"), occupancy_pricing: { adult: 48000, teen: 38000, child: 25000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-18", service_type: "package", agency_id: "agency-beta",
    title: "Johannesburg & Soweto Cultural Immersion",
    destination: "SOUTH_AFRICA", base_price_mur: 36000, service_fee: 12,
    travel_month: "2026-11", hotel_name: "Four Seasons Westcliff Johannesburg", hotel_stars: 5,
    description: "Walk Vilakazi Street — the only street in the world with two Nobel laureates — visit the Apartheid Museum, and tour Soweto with a local guide.",
    is_active: true, is_archived: false, created_at: "2026-06-15T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1550586678-f71f112e84c9?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1522049380963-14dbfbf138be?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("SOUTH_AFRICA"), occupancy_pricing: { adult: 36000, teen: 29000, child: 19000, infant: 0 }, reviews: []
  },
  // ─── RODRIGUES ───────────────────────────────────────────────────────
  {
    id: "pkg-19", service_type: "package", agency_id: "agency-alpha",
    title: "Rodrigues Island Escape — 5 Nights",
    destination: "RODRIGUES", base_price_mur: 26000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Cotton Bay Hotel", hotel_stars: 4,
    description: "The untouched sister island of Mauritius. Crystal-clear lagoon, kite surfing at Mourouk, octopus fishing with local fishermen, and cicadas at sunset.",
    is_active: true, is_archived: false, created_at: "2026-06-16T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("RODRIGUES"), occupancy_pricing: { adult: 26000, teen: 21000, child: 13000, infant: 0 }, reviews: [{ author: "Yves D.", rating: 5, comment: "Rodrigues is a hidden gem — so peaceful and authentic." }]
  },
  {
    id: "pkg-20", service_type: "package", agency_id: "agency-beta",
    title: "Rodrigues Dive & Snorkel Adventure",
    destination: "RODRIGUES", base_price_mur: 30000, service_fee: 10,
    travel_month: "2026-10", hotel_name: "Tekoma Boutique Hotel", hotel_stars: 4,
    description: "Explore some of the Indian Ocean's best dive sites — pristine coral, sleeping sharks at Shark Point, and tropical fish at Hermitage Lagoon.",
    is_active: true, is_archived: false, created_at: "2026-06-17T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1620023602934-85514f0896fa?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("RODRIGUES"), occupancy_pricing: { adult: 30000, teen: 24000, child: 15000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-21", service_type: "package", agency_id: "agency-alpha",
    title: "Rodrigues Family Beach Holiday",
    destination: "RODRIGUES", base_price_mur: 22000, service_fee: 12,
    travel_month: "2026-08", hotel_name: "Aux Deux Frères", hotel_stars: 3,
    description: "A wholesome family beach holiday on Rodrigues — safe shallow lagoon for kids, bicycle tours around the island, and fresh Creole seafood every evening.",
    is_active: true, is_archived: false, created_at: "2026-06-18T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("RODRIGUES"), occupancy_pricing: { adult: 22000, teen: 17000, child: 11000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-22", service_type: "package", agency_id: "agency-beta",
    title: "Rodrigues Kite & Wind Sports Week",
    destination: "RODRIGUES", base_price_mur: 34000, service_fee: 10,
    travel_month: "2026-11", hotel_name: "Mourouk Ebony Hotel", hotel_stars: 4,
    description: "Rodrigues is rated one of the world's top kite surfing destinations. Spend 7 days riding consistent 25-knot trade winds at Anse Mourouk, with lessons for all levels.",
    is_active: true, is_archived: false, created_at: "2026-06-19T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1620023602934-85514f0896fa?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("RODRIGUES"), occupancy_pricing: { adult: 34000, teen: 27000, child: 0, infant: 0 }, reviews: [{ author: "Stefan V.", rating: 5, comment: "World-class kiting. Booked again for next year!" }]
  },
  // ─── RÉUNION ─────────────────────────────────────────────────────────
  {
    id: "pkg-23", service_type: "package", agency_id: "agency-alpha",
    title: "Réunion Volcano Caldera Trek",
    destination: "REUNION", base_price_mur: 34000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Iloha Seaview Hotel Saint-Leu", hotel_stars: 4,
    description: "Hike into the Piton de la Fournaise, one of the world's most active volcanoes — witness lava landscapes, lunar terrain, and breathtaking crater views.",
    is_active: true, is_archived: false, created_at: "2026-06-20T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1467220369-2081f2a53bc9?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("REUNION"), occupancy_pricing: { adult: 34000, teen: 27000, child: 18000, infant: 0 }, reviews: [{ author: "François B.", rating: 5, comment: "Standing on the volcano rim was unreal. Perfectly guided." }]
  },
  {
    id: "pkg-24", service_type: "package", agency_id: "agency-beta",
    title: "Réunion Coastal & Cirques Discovery",
    destination: "REUNION", base_price_mur: 28000, service_fee: 12,
    travel_month: "2026-10", hotel_name: "Le Saint Alexis Hotel & Spa", hotel_stars: 4,
    description: "Explore the three spectacular cirques — Cilaos, Mafate, and Salazie — dramatic natural amphitheatres carved by ancient volcanic activity, with waterfalls and Creole villages.",
    is_active: true, is_archived: false, created_at: "2026-06-21T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1467220369-2081f2a53bc9?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("REUNION"), occupancy_pricing: { adult: 28000, teen: 22000, child: 15000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-25", service_type: "package", agency_id: "agency-alpha",
    title: "Réunion Surf & Beach Package",
    destination: "REUNION", base_price_mur: 22000, service_fee: 12,
    travel_month: "2026-08", hotel_name: "Palm Hotel & Spa Saint-Gilles", hotel_stars: 4,
    description: "Réunion's west coast lagoon has world-class surf breaks at Saint-Leu and crystal-clear snorkelling at l'Hermitage Reef — the Indian Ocean's best surf island.",
    is_active: true, is_archived: false, created_at: "2026-06-22T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1533052865963-305739097746?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("REUNION"), occupancy_pricing: { adult: 22000, teen: 18000, child: 11000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-26", service_type: "package", agency_id: "agency-beta",
    title: "Réunion Wellness Spa & Nature Retreat",
    destination: "REUNION", base_price_mur: 38000, service_fee: 10,
    travel_month: "2026-11", hotel_name: "Constance Belle Mare Plage Réunion", hotel_stars: 5,
    description: "Recharge in a luxury spa resort with yoga at sunrise, forest bathing in the Bélouve rainforest, and gourmet Creole cuisine made with fresh local produce.",
    is_active: true, is_archived: false, created_at: "2026-06-23T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1533052865963-305739097746?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("REUNION"), occupancy_pricing: { adult: 38000, teen: 0, child: 0, infant: 0 }, reviews: [{ author: "Nathalie R.", rating: 5, comment: "The spa and the hiking — a perfect combination." }]
  },
  // ─── MALDIVES ────────────────────────────────────────────────────────
  {
    id: "pkg-27", service_type: "package", agency_id: "agency-alpha",
    title: "Maldives Overwater Villa Honeymoon",
    destination: "MALDIVES", base_price_mur: 98000, service_fee: 8,
    travel_month: "2026-11", hotel_name: "Conrad Maldives Rangali Island", hotel_stars: 5,
    description: "Sleep above a turquoise lagoon in a glass-floor overwater villa, dine underwater at Ithaa, and wake each morning to nothing but ocean horizon — pure paradise.",
    is_active: true, is_archived: false, created_at: "2026-06-24T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 98000, teen: 0, child: 0, infant: 0 }, reviews: [{ author: "Aisha & Raj", rating: 5, comment: "Absolute heaven. Nothing else compares." }]
  },
  {
    id: "pkg-28", service_type: "package", agency_id: "agency-beta",
    title: "Maldives Dive Safari — Liveaboard",
    destination: "MALDIVES", base_price_mur: 72000, service_fee: 8,
    travel_month: "2026-10", hotel_name: "Emperor Atoll Liveaboard Vessel", hotel_stars: 4,
    description: "Live aboard a luxury dive vessel and explore 3–4 dive sites daily — whale sharks at South Ari Atoll, manta rays at Hanifaru Bay, and pristine hard coral at Vaavu.",
    is_active: true, is_archived: false, created_at: "2026-06-25T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1605635833443-02f43bb609b5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1540202404-d0f7b90b3028?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 72000, teen: 60000, child: 0, infant: 0 }, reviews: [{ author: "Marco P.", rating: 5, comment: "Dove with manta rays every day. A diver's dream!" }]
  },
  {
    id: "pkg-29", service_type: "package", agency_id: "agency-alpha",
    title: "Maldives All-Inclusive Family Resort",
    destination: "MALDIVES", base_price_mur: 55000, service_fee: 10,
    travel_month: "2026-12", hotel_name: "Sun Siyam Iru Veli", hotel_stars: 5,
    description: "Unlimited food, drinks, watersports, and kids' club in one of the Maldives' top all-inclusive resorts. Even the kids can learn to snorkel and kayak.",
    is_active: true, is_archived: false, created_at: "2026-06-26T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 55000, teen: 44000, child: 28000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-30", service_type: "package", agency_id: "agency-beta",
    title: "Maldives Sunset Cruise & Sandbank Picnic",
    destination: "MALDIVES", base_price_mur: 48000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Velaa Private Island", hotel_stars: 5,
    description: "A private catamaran sunset cruise with Champagne, a deserted sandbank picnic with lobster, and a night dive to see bio-luminescent plankton.",
    is_active: true, is_archived: false, created_at: "2026-06-27T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1605635833443-02f43bb609b5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1540202404-d0f7b90b3028?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 48000, teen: 38000, child: 25000, infant: 0 }, reviews: [{ author: "Linda T.", rating: 5, comment: "The sandbank picnic was pure magic." }]
  },
  {
    id: "pkg-31", service_type: "package", agency_id: "agency-alpha",
    title: "Maldives Budget Guesthouse Island Hop",
    destination: "MALDIVES", base_price_mur: 28000, service_fee: 12,
    travel_month: "2026-08", hotel_name: "Local Guesthouses — Maafushi & Thulusdhoo", hotel_stars: 3,
    description: "Experience authentic Maldivian life on local islands — no resort prices! Snorkel off the house reef, rent a bicycle, and eat local curries for a fraction of the cost.",
    is_active: true, is_archived: false, created_at: "2026-06-28T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1540202404-d0f7b90b3028?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 28000, teen: 22000, child: 14000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-32", service_type: "package", agency_id: "agency-beta",
    title: "Maldives Wellness & Yoga Retreat",
    destination: "MALDIVES", base_price_mur: 78000, service_fee: 8,
    travel_month: "2026-11", hotel_name: "COMO Maalifushi", hotel_stars: 5,
    description: "Sunrise yoga on a floating deck, Shambhala spa treatments with ocean views, ayurvedic consultations, and clean organic dining — the ultimate mind-body reset.",
    is_active: true, is_archived: false, created_at: "2026-06-29T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1605635833443-02f43bb609b5?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 78000, teen: 0, child: 0, infant: 0 }, reviews: [{ author: "Elena S.", rating: 5, comment: "Left feeling completely renewed. The spa was extraordinary." }]
  },
  {
    id: "pkg-33", service_type: "package", agency_id: "agency-alpha",
    title: "Grand Maldives — 10 Night Ultimate",
    destination: "MALDIVES", base_price_mur: 125000, service_fee: 8,
    travel_month: "2026-12", hotel_name: "Gili Lankanfushi", hotel_stars: 5,
    description: "The crown jewel of Maldives holidays — overwater villa, private butler, private pool, helicopter arrival, big game fishing, and a private chef dinner on your deck.",
    is_active: true, is_archived: false, created_at: "2026-06-30T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("MALDIVES"), occupancy_pricing: { adult: 125000, teen: 0, child: 0, infant: 0 }, reviews: [{ author: "Michael & Jane W.", rating: 5, comment: "The private butler made every moment perfect. No words." }]
  },
  // ─── BONUS — MULTI-DESTINATION ───────────────────────────────────────
  {
    id: "pkg-34", service_type: "package", agency_id: "agency-alpha",
    title: "South Africa & Maldives Grand Tour",
    destination: "SOUTH_AFRICA", base_price_mur: 115000, service_fee: 8,
    travel_month: "2026-10", hotel_name: "Singita + Velaa Private Island", hotel_stars: 5,
    description: "The ultimate two-destination combo: 5 nights on safari in Kruger spotting lions and elephants, then fly to the Maldives for 5 nights of pure overwater luxury.",
    is_active: true, is_archived: false, created_at: "2026-07-01T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("SOUTH_AFRICA"), occupancy_pricing: { adult: 115000, teen: 90000, child: 0, infant: 0 }, reviews: [{ author: "Robert M.", rating: 5, comment: "Safari to Maldives — the two best experiences of my life." }]
  },
  {
    id: "pkg-35", service_type: "package", agency_id: "agency-beta",
    title: "Dubai & Malaysia Twin City Explorer",
    destination: "DUBAI", base_price_mur: 48000, service_fee: 10,
    travel_month: "2026-09", hotel_name: "Marriott Dubai + Traders KL", hotel_stars: 5,
    description: "4 nights in futuristic Dubai — Burj Khalifa, desert safari, dhow cruise — then fly to Kuala Lumpur for 4 nights of street food, Petronas Towers, and Batu Caves.",
    is_active: true, is_archived: false, created_at: "2026-07-02T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("DUBAI"), occupancy_pricing: { adult: 48000, teen: 38000, child: 25000, infant: 0 }, reviews: []
  },
  {
    id: "pkg-36", service_type: "package", agency_id: "agency-alpha",
    title: "Island Trio: Rodrigues + Réunion + Maldives",
    destination: "RODRIGUES", base_price_mur: 88000, service_fee: 8,
    travel_month: "2026-10", hotel_name: "Cotton Bay + Palm Saint-Gilles + Conrad Maldives", hotel_stars: 5,
    description: "Three island paradises in one trip — wild Rodrigues for authenticity, volcanic Réunion for adventure, then the Maldives for pure luxury. Indian Ocean perfection.",
    is_active: true, is_archived: false, created_at: "2026-07-03T08:00:00Z",
    gallery_images: ["https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800"],
    itinerary_days: getItineraryDays("RODRIGUES"), occupancy_pricing: { adult: 88000, teen: 70000, child: 45000, infant: 0 }, reviews: [{ author: "Chantelle F.", rating: 5, comment: "Three islands, three experiences, one unforgettable trip!" }]
  },
];



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
    is_featured: true,
    flight_included: true,
    meal_plan: "Half Board",
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

