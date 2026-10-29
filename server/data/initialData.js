const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
const staffPasswordHash = bcrypt.hashSync('Staff@123', salt);
const guestPasswordHash = bcrypt.hashSync('Guest@123', salt);

const initialUsers = [
  {
    _id: '65f000000000000000000001',
    name: 'Victoria Sterling',
    email: 'admin@hotelpro.com',
    password: adminPasswordHash,
    role: 'admin',
    phone: '+1 (555) 100-2000',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    address: { street: '100 Executive Grand Blvd', city: 'Metropolis', country: 'United States' },
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    _id: '65f000000000000000000002',
    name: 'Marcus Vance',
    email: 'staff@hotelpro.com',
    password: staffPasswordHash,
    role: 'staff',
    phone: '+1 (555) 100-2001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    address: { street: '42 Beacon Way', city: 'Metropolis', country: 'United States' },
    createdAt: new Date('2026-01-15T00:00:00Z'),
  },
  {
    _id: '65f000000000000000000003',
    name: 'Alexander Wright',
    email: 'guest@hotelpro.com',
    password: guestPasswordHash,
    role: 'guest',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    address: { street: '742 Evergreen Terrace', city: 'Springfield', country: 'United States' },
    createdAt: new Date('2026-02-01T00:00:00Z'),
  },
  {
    _id: '65f000000000000000000004',
    name: 'Sophia Montgomery',
    email: 'sophia@voyage.org',
    password: guestPasswordHash,
    role: 'guest',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    address: { street: '12 Kensington High St', city: 'London', country: 'United Kingdom' },
    createdAt: new Date('2026-02-10T00:00:00Z'),
  }
];

const initialRooms = [
  {
    _id: '65f100000000000000000101',
    roomNumber: '101',
    title: 'Deluxe King Oceanfront Sanctuary',
    roomType: 'Deluxe King',
    pricePerNight: 285,
    capacity: { adults: 2, children: 1 },
    bedType: 'Californian King Bed',
    sizeSqFt: 520,
    floor: 1,
    description: 'Immerse yourself in coastal luxury with uninterrupted floor-to-ceiling panoramic ocean vistas. Features a custom plush king mattress, private glass-front balcony, Carrara marble bath with soaking tub, and smart ambient mood lighting.',
    amenities: [
      'Ocean View Balcony',
      'Carrara Marble Bath',
      'High-Speed Wi-Fi (1 Gbps)',
      'Smart 4K UHD TV 65"',
      'Nespresso Artisan Bar',
      'In-Room Safe',
      'Bose Sound System',
      '24/7 Butler & Room Service'
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'booked',
    rating: 4.95,
    reviewsCount: 38,
    isFeatured: true,
    createdAt: new Date('2026-01-01T00:00:00Z')
  },
  {
    _id: '65f100000000000000000102',
    roomNumber: '102',
    title: 'Executive Suite with Private Terrace',
    roomType: 'Executive Suite',
    pricePerNight: 395,
    capacity: { adults: 3, children: 1 },
    bedType: 'King Bed & Ergonomic Sofa Bed',
    sizeSqFt: 680,
    floor: 1,
    description: 'Crafted for distinguished business travelers and leisure seekers alike. Includes a separate executive lounge workstation, bespoke Italian leather furnishing, walk-in dressing wardrobe, and a private botanical terrace.',
    amenities: [
      'Private Botanical Terrace',
      'Executive Ergonomic Workspace',
      'Dual Rain Showers',
      'Premium Mini Bar Stocked Daily',
      'Smart 4K UHD TV 75"',
      'Motorized Blackout Drapes',
      'High-Speed Wi-Fi (1 Gbps)',
      'Complimentary Airport Chauffeur'
    ],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    rating: 4.91,
    reviewsCount: 26,
    isFeatured: true,
    createdAt: new Date('2026-01-02T00:00:00Z')
  },
  {
    _id: '65f100000000000000000201',
    roomNumber: '201',
    title: 'The Royal Presidential Penthouse',
    roomType: 'Presidential Suite',
    pricePerNight: 780,
    capacity: { adults: 4, children: 2 },
    bedType: '2 Grand King Master Suites',
    sizeSqFt: 1250,
    floor: 2,
    description: 'The pinnacle of opulence and architectural excellence. Enjoy dual master suites, private heated plunge pool on the rooftop terrace, a grand baby grand piano, curated fine art collection, and dedicated round-the-clock VIP butler.',
    amenities: [
      'Private Heated Rooftop Plunge Pool',
      'Panoramic 360 Sky Deck',
      'Dedicated 24/7 VIP Butler',
      'Private Wine Cellar & Sommelier Service',
      'Jacuzzi Spa Bath',
      'Acoustic Bang & Olufsen Sound Suite',
      'Private Chef Dining Table',
      'VIP Airport Limousine Transfer'
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
    createdAt: new Date('2026-01-03T00:00:00Z')
  },
  {
    _id: '65f100000000000000000202',
    roomNumber: '202',
    title: 'Premium Double Queen Skyline View',
    roomType: 'Premium Double',
    pricePerNight: 240,
    capacity: { adults: 4, children: 1 },
    bedType: '2 Plush Queen Beds',
    sizeSqFt: 480,
    floor: 2,
    description: 'Spacious elegance designed for families or traveling companions. Featuring two decadent queen beds with hypoallergenic Egyptian cotton bedding, expansive city skyline windows, and a spa-inspired bathroom.',
    amenities: [
      'City Skyline Vistas',
      '2 Plush Queen Beds',
      'High-Speed Wi-Fi',
      'Espresso & Herbal Tea Bar',
      'Smart 55" Entertainment Hub',
      'In-Room Climate Control',
      'Designer Toiletries by Molton Brown'
    ],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    rating: 4.84,
    reviewsCount: 42,
    isFeatured: false,
    createdAt: new Date('2026-01-04T00:00:00Z')
  },
  {
    _id: '65f100000000000000000301',
    roomNumber: '301',
    title: 'Skyline Penthouse Loft with Sunken Tub',
    roomType: 'Skyline Penthouse',
    pricePerNight: 620,
    capacity: { adults: 2, children: 1 },
    bedType: 'Floating Master King Bed',
    sizeSqFt: 850,
    floor: 3,
    description: 'A contemporary glass loft suspended above the city lights. Features a floating king bed, an open-concept Japanese sunken cedar tub overlooking the horizon, and modern fireplace.',
    amenities: [
      'Japanese Sunken Cedar Tub',
      'Modern Ethanol Fireplace',
      'Private High-Speed Elevator Access',
      'Curated Cocktail Mini Bar',
      'Smart Touch Glass Automation',
      'Breakfast in Bed Daily'
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'cleaning',
    rating: 4.96,
    reviewsCount: 22,
    isFeatured: true,
    createdAt: new Date('2026-01-05T00:00:00Z')
  },
  {
    _id: '65f100000000000000000302',
    roomNumber: '302',
    title: 'Secret Garden Villa Oasis',
    roomType: 'Garden Villa',
    pricePerNight: 350,
    capacity: { adults: 2, children: 2 },
    bedType: 'King Four-Poster Bed',
    sizeSqFt: 620,
    floor: 3,
    description: 'Step directly into secluded tropical flora and tranquil water fountains. Features an outdoor rainfall shower, handmade teak furnishings, and birdsong morning ambiance.',
    amenities: [
      'Direct Private Garden Access',
      'Outdoor Tropical Rain Shower',
      'Hammock & Sun Lounge Cabana',
      'Artisan Tea & Pour-Over Coffee',
      'Organic Lavender Bath Salts',
      'High-Speed Wi-Fi'
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    rating: 4.89,
    reviewsCount: 31,
    isFeatured: false,
    createdAt: new Date('2026-01-06T00:00:00Z')
  },
  {
    _id: '65f100000000000000000401',
    roomNumber: '401',
    title: 'Superior Grand Family Haven',
    roomType: 'Family Suite',
    pricePerNight: 430,
    capacity: { adults: 4, children: 3 },
    bedType: '1 King Bed + 2 Twin Beds + Daybed',
    sizeSqFt: 880,
    floor: 4,
    description: 'The ultimate sanctuary for memorable family getaways. Features two connecting bedrooms, kid-friendly game lounge with gaming console, kitchenette with microwave, and child safety amenities.',
    amenities: [
      'Two Connecting Master Bedrooms',
      'PlayStation 5 Gaming Station',
      'Fully Equipped Kitchenette',
      'Baby Crib & High Chair Upon Request',
      'Complimentary Family Movie Night Passes',
      'Two Full En-Suite Bathrooms'
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
    ],
    status: 'maintenance',
    rating: 4.88,
    reviewsCount: 15,
    isFeatured: false,
    createdAt: new Date('2026-01-07T00:00:00Z')
  }
];

const initialBookings = [
  {
    _id: '65f200000000000000000001',
    bookingNumber: 'HP-2026-8812',
    user: '65f000000000000000000003',
    room: '65f100000000000000000101',
    checkInDate: new Date('2026-10-28T14:00:00Z'),
    checkOutDate: new Date('2026-10-31T11:00:00Z'),
    totalNights: 3,
    guests: { adults: 2, children: 0 },
    guestInfo: {
      fullName: 'Alexander Wright',
      email: 'guest@hotelpro.com',
      phone: '+1 (555) 345-6789',
      specialRequests: 'High floor preferred, late check-in around 8 PM, extra feather pillows.'
    },
    pricing: {
      roomRate: 285,
      nightsTotal: 855,
      taxes: 102.6,
      cleaningFee: 35,
      discount: 0,
      grandTotal: 992.6
    },
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    paymentDetails: {
      transactionId: 'TXN-9823412',
      cardLast4: '4242',
      paidAt: new Date('2026-10-20T10:15:00Z')
    },
    status: 'checked_in',
    checkInTime: new Date('2026-10-28T15:20:00Z'),
    createdAt: new Date('2026-10-20T10:15:00Z')
  },
  {
    _id: '65f200000000000000000002',
    bookingNumber: 'HP-2026-9041',
    user: '65f000000000000000000004',
    room: '65f100000000000000000102',
    checkInDate: new Date('2026-11-05T14:00:00Z'),
    checkOutDate: new Date('2026-11-09T11:00:00Z'),
    totalNights: 4,
    guests: { adults: 2, children: 1 },
    guestInfo: {
      fullName: 'Sophia Montgomery',
      email: 'sophia@voyage.org',
      phone: '+1 (555) 890-1234',
      specialRequests: 'Celebrating wedding anniversary. Champagne and roses setup please!'
    },
    pricing: {
      roomRate: 395,
      nightsTotal: 1580,
      taxes: 189.6,
      cleaningFee: 35,
      discount: 50,
      grandTotal: 1754.6
    },
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    paymentDetails: {
      transactionId: 'TXN-7731209',
      cardLast4: '8831',
      paidAt: new Date('2026-10-25T14:30:00Z')
    },
    status: 'confirmed',
    createdAt: new Date('2026-10-25T14:30:00Z')
  }
];

const initialReviews = [
  {
    _id: '65f300000000000000000001',
    user: '65f000000000000000000003',
    room: '65f100000000000000000101',
    rating: 5,
    title: 'Spectacular stay with immaculate hospitality!',
    comment: 'The oceanfront view took my breath away every single morning. The room was pristine, the linen was buttery soft, and the front desk staff went above and beyond for every request.',
    createdAt: new Date('2026-10-15T09:30:00Z')
  },
  {
    _id: '65f300000000000000000002',
    user: '65f000000000000000000004',
    room: '65f100000000000000000102',
    rating: 5,
    title: 'Top-tier luxury and seamless digital experience',
    comment: 'HotelPro makes booking, check-in, and ordering room services effortless. The terrace in Suite 102 was our favorite spot for sunset coffee.',
    createdAt: new Date('2026-10-18T18:45:00Z')
  }
];

const initialServices = [
  {
    _id: '65f400000000000000000001',
    booking: '65f200000000000000000001',
    room: '65f100000000000000000101',
    user: '65f000000000000000000003',
    type: 'Housekeeping',
    priority: 'medium',
    status: 'in_progress',
    notes: 'Guest requested afternoon turn-down service and additional plush bath towels.',
    requestedAt: new Date('2026-10-29T14:00:00Z')
  },
  {
    _id: '65f400000000000000000002',
    room: '65f100000000000000000301',
    user: '65f000000000000000000001',
    type: 'Maintenance',
    priority: 'high',
    status: 'completed',
    notes: 'Preventative inspection on Japanese sunken cedar tub water pressure pump.',
    requestedAt: new Date('2026-10-28T10:00:00Z'),
    completedAt: new Date('2026-10-28T11:30:00Z')
  },
  {
    _id: '65f400000000000000000003',
    booking: '65f200000000000000000001',
    room: '65f100000000000000000101',
    user: '65f000000000000000000003',
    type: 'Room Service',
    priority: 'low',
    status: 'pending',
    notes: 'Midnight Artisan Truffle Burger & Sparkling San Pellegrino delivery to Room 101.',
    requestedAt: new Date('2026-10-29T16:30:00Z')
  }
];

module.exports = {
  initialUsers,
  initialRooms,
  initialBookings,
  initialReviews,
  initialServices
};
