import type { Location } from '../types';

// ─── City Location Data ───────────────────────────────────────────────────────
// Fictional city: "Nova Crest" — a vibrant, cosmopolitan coastal city.

export const locations: Location[] = [
  // ── FOOD ──────────────────────────────────────────────────────────────────
  {
    id: 'f1',
    name: 'The Golden Fork',
    category: 'Food',
    subCategory: 'Restaurant',
    rating: 4.8,
    reviewCount: 1243,
    description:
      'Award-winning fine dining with a contemporary twist on coastal cuisine. The Golden Fork sources its seafood daily from local fishermen and pairs each dish with curated Nova Crest wines. The ambiance blends exposed brick with warm Edison lighting, creating an intimate yet lively atmosphere perfect for special occasions.',
    shortDesc: 'Fine dining coastal cuisine with award-winning seafood.',
    address: '12 Harbor View Blvd, Nova Crest Marina District',
    openHours: 'Mon–Sun: 12:00 PM – 11:00 PM',
    distance: '0.3 km',
    tags: ['Fine Dining', 'Seafood', 'Wine', 'Romantic'],
    imageGradient: 'from-amber-600 via-orange-500 to-yellow-400',
    icon: '🍽️',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop',
    featured: true,
    priceRange: '$$$',
    phone: '+1 (555) 201-4400',
    website: 'goldenfork.novacrest.com',
  },
  {
    id: 'f2',
    name: 'Sakura Noodle House',
    category: 'Food',
    subCategory: 'Restaurant',
    rating: 4.6,
    reviewCount: 987,
    description:
      'Authentic Japanese ramen and udon in a warm, minimalist setting. The broth is slow-simmered for 18 hours using traditional techniques brought directly from Osaka. Their signature Spicy Miso Ramen has been voted best ramen in Nova Crest for three consecutive years.',
    shortDesc: 'Authentic 18-hour slow-simmered Japanese ramen.',
    address: '45 East Bloom Street, Nova Crest Cultural Quarter',
    openHours: 'Tue–Sun: 11:30 AM – 10:00 PM',
    distance: '0.7 km',
    tags: ['Japanese', 'Ramen', 'Vegetarian Options', 'Casual'],
    imageGradient: 'from-rose-600 via-pink-500 to-red-400',
    icon: '🍜',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop',
    priceRange: '$$',
    phone: '+1 (555) 334-8821',
  },
  {
    id: 'f3',
    name: 'Brew & Bloom Café',
    category: 'Food',
    subCategory: 'Cafe',
    rating: 4.5,
    reviewCount: 762,
    description:
      'A beloved specialty coffee shop and brunch destination nestled in Nova Crest\'s art district. The café doubles as a rotating gallery for local artists. Their house-roasted single-origin beans produce an exceptional cup, and the avocado toast with poached eggs has become legendary among locals and tourists alike.',
    shortDesc: 'Specialty coffee & brunch in a living art gallery.',
    address: '8 Palette Lane, Nova Crest Arts District',
    openHours: 'Mon–Fri: 7:00 AM – 6:00 PM | Sat–Sun: 8:00 AM – 7:00 PM',
    distance: '0.5 km',
    tags: ['Coffee', 'Brunch', 'Art', 'Vegan Options'],
    imageGradient: 'from-teal-600 via-emerald-500 to-green-400',
    icon: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
    priceRange: '$',
    phone: '+1 (555) 489-0033',
  },
  {
    id: 'f4',
    name: 'Rooftop Tapas & Bar',
    category: 'Food',
    subCategory: 'Bar',
    rating: 4.4,
    reviewCount: 534,
    description:
      'Experience Nova Crest from above. This chic rooftop bar on the 22nd floor of the Meridian Tower offers panoramic city views paired with expertly crafted tapas and artisan cocktails. Watch the sunset over the harbor while sipping a Nova Sunrise — the bar\'s signature cocktail made with local citrus.',
    shortDesc: '22nd-floor rooftop bar with panoramic city views.',
    address: '1 Meridian Tower, Nova Crest Central',
    openHours: 'Wed–Sun: 4:00 PM – 2:00 AM',
    distance: '1.1 km',
    tags: ['Cocktails', 'Tapas', 'Views', 'Nightlife'],
    imageGradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    icon: '🍹',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop',
    priceRange: '$$$',
    phone: '+1 (555) 720-9900',
  },

  // ── ATTRACTIONS ────────────────────────────────────────────────────────────
  {
    id: 'a1',
    name: 'Nova Crest Art Museum',
    category: 'Attractions',
    subCategory: 'Museum',
    rating: 4.9,
    reviewCount: 3241,
    description:
      'Nova Crest\'s premier cultural institution houses over 15,000 works spanning five centuries. The permanent collection features Renaissance masters alongside a world-class modern wing. The interactive "Digital Futures" exhibition blends augmented reality with classical sculpture in a truly unforgettable way. Guided tours depart every hour.',
    shortDesc: '15,000+ artworks across 5 centuries of human creativity.',
    address: '1 Museum Plaza, Nova Crest Cultural Quarter',
    openHours: 'Tue–Sun: 9:00 AM – 6:00 PM | Thu until 9:00 PM',
    distance: '0.9 km',
    tags: ['Art', 'Culture', 'Interactive', 'Guided Tours'],
    imageGradient: 'from-blue-700 via-indigo-600 to-blue-400',
    icon: '🏛️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg',
    featured: true,
    phone: '+1 (555) 100-2222',
    website: 'ncam.novacrest.com',
  },
  {
    id: 'a2',
    name: 'Lighthouse Point Park',
    category: 'Attractions',
    subCategory: 'Park',
    rating: 4.7,
    reviewCount: 2108,
    description:
      'A stunning coastal park wrapping around the historic 1887 lighthouse at the northern tip of Nova Crest. The park features 8 km of walking trails, tidal pools rich with marine life, a children\'s adventure area, and a weekend farmers\' market. The lighthouse itself is open for tours every Saturday and Sunday.',
    shortDesc: 'Coastal trails, tidal pools & a historic 1887 lighthouse.',
    address: 'Lighthouse Point Rd, Nova Crest North Shore',
    openHours: 'Daily: 6:00 AM – 9:00 PM (Lighthouse: Sat–Sun 10AM–5PM)',
    distance: '2.4 km',
    tags: ['Nature', 'Walking Trails', 'Historic', 'Family Friendly'],
    imageGradient: 'from-cyan-600 via-sky-500 to-blue-400',
    icon: '🌊',
    imageUrl: 'https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=600&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'a3',
    name: 'The Glass Observatory',
    category: 'Attractions',
    subCategory: 'Landmark',
    rating: 4.6,
    reviewCount: 1876,
    description:
      'Nova Crest\'s most iconic architectural marvel: a fully glass-enclosed observatory perched at the summit of Crest Hill. The 360° panoramic view encompasses the entire city, coastline, and distant mountain ranges. At night, the city lights transform the view into a breathtaking light display. Telescope sessions are available after 8 PM.',
    shortDesc: '360° panoramic glass observatory atop Crest Hill.',
    address: 'Summit Road, Crest Hill, Nova Crest',
    openHours: 'Daily: 10:00 AM – 11:00 PM',
    distance: '3.1 km',
    tags: ['Views', 'Architecture', 'Photography', 'Night Sky'],
    imageGradient: 'from-slate-700 via-sky-600 to-cyan-400',
    icon: '🔭',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Griffith_observatory_2006.jpg',
    priceRange: '$$',
    phone: '+1 (555) 650-3344',
    website: 'glassobservatory.novacrest.com',
  },
  {
    id: 'a4',
    name: 'Nova Crest Botanical Garden',
    category: 'Attractions',
    subCategory: 'Park',
    rating: 4.5,
    reviewCount: 1432,
    description:
      'Over 5,000 plant species from six continents thrive across 20 hectares of meticulously designed landscapes. The tropical greenhouse, Japanese zen garden, and the spectacular Rose Amphitheater are among the highlights. The garden also hosts open-air concerts every Friday evening throughout summer.',
    shortDesc: '5,000+ species across 20 hectares of living landscapes.',
    address: '300 Garden Way, Nova Crest South Park',
    openHours: 'Tue–Sun: 8:00 AM – 6:00 PM',
    distance: '1.8 km',
    tags: ['Nature', 'Gardens', 'Photography', 'Concerts'],
    imageGradient: 'from-green-700 via-emerald-500 to-lime-400',
    icon: '🌿',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Kew_Gardens_Palm_House%2C_London_-_July_2009.jpg',
    priceRange: '$',
    phone: '+1 (555) 870-1122',
  },

  // ── TRANSPORT ──────────────────────────────────────────────────────────────
  {
    id: 't1',
    name: 'Central Metro Hub',
    category: 'Transport',
    subCategory: 'Metro',
    rating: 4.3,
    reviewCount: 5621,
    description:
      'Nova Crest\'s primary metro interchange connects all 6 metro lines serving the city and suburbs. Real-time digital boards display arrival times across all platforms. The hub also houses a tourism information booth, luggage storage, currency exchange, and multiple retail outlets. Trains run every 4 minutes during peak hours.',
    shortDesc: 'Main metro interchange — 6 lines, trains every 4 minutes.',
    address: 'Central Station Square, Nova Crest CBD',
    openHours: 'Daily: 5:00 AM – 1:00 AM (24h on weekends)',
    distance: '0.6 km',
    tags: ['Metro', 'Transit Hub', 'Accessible', 'Air Conditioned'],
    imageGradient: 'from-gray-700 via-zinc-600 to-slate-500',
    icon: '🚇',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Image-Grand_central_Station_Outside_Night_2.jpg',
    featured: true,
    phone: '+1 (555) 999-METRO',
    website: 'novacrestmetro.com',
  },
  {
    id: 't2',
    name: 'Harbor Ferry Terminal',
    category: 'Transport',
    subCategory: 'Train',
    rating: 4.6,
    reviewCount: 1089,
    description:
      'Step aboard a scenic harbor ferry connecting Nova Crest\'s marina district to the outlying islands and the historic Old Town pier. Ferries depart every 30 minutes and the 20-minute crossing offers exceptional views of the city skyline. A guided commentary is available on the upper deck during tourist season.',
    shortDesc: 'Scenic ferry to islands & Old Town — departs every 30 min.',
    address: 'Pier 7, Nova Crest Marina District',
    openHours: 'Daily: 7:00 AM – 10:00 PM',
    distance: '0.4 km',
    tags: ['Ferry', 'Scenic', 'Island Access', 'Tourist Friendly'],
    imageGradient: 'from-blue-600 via-cyan-500 to-teal-400',
    icon: '⛴️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Spirit_of_America_-_Staten_Island_Ferry.jpg',
    priceRange: '$$',
    phone: '+1 (555) 787-SAIL',
    website: 'novacrestferry.com',
  },
  {
    id: 't3',
    name: 'City Hop Bus Network',
    category: 'Transport',
    subCategory: 'Bus',
    rating: 4.1,
    reviewCount: 2344,
    description:
      'The City Hop tourist bus network covers all major attractions with hop-on, hop-off convenience across 3 scenic routes. Double-decker open-top buses feature live commentary in 8 languages. A day pass grants unlimited rides and includes discounts at 20+ partner attractions. Buses depart every 15 minutes from all designated stops.',
    shortDesc: 'Hop-on hop-off tourist buses with live commentary in 8 languages.',
    address: 'Stop 1: Kiosk Plaza, Nova Crest Central',
    openHours: 'Daily: 8:00 AM – 8:00 PM',
    distance: '0.1 km',
    tags: ['Bus', 'Hop-On Hop-Off', 'Multilingual', 'Day Pass'],
    imageGradient: 'from-orange-600 via-amber-500 to-yellow-400',
    icon: '🚌',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/RM8_AEC_Routemaster.jpg',
    priceRange: '$$',
    phone: '+1 (555) 555-HOPS',
    website: 'cityhop.novacrest.com',
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getFeaturedLocations = (): Location[] =>
  locations.filter((l) => l.featured);

export const getLocationsByCategory = (
  category: 'Food' | 'Attractions' | 'Transport'
): Location[] => locations.filter((l) => l.category === category);

export const searchLocations = (query: string): Location[] => {
  const q = query.toLowerCase().trim();
  if (!q) return locations;
  return locations.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.subCategory.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)) ||
      l.shortDesc.toLowerCase().includes(q)
  );
};

export const CATEGORY_META: Record<
  'All' | 'Food' | 'Attractions' | 'Transport',
  { icon: string; color: string; bgColor: string; borderColor: string; description: string }
> = {
  All: {
    icon: '🗺️',
    color: 'text-white',
    bgColor: 'bg-white/10',
    borderColor: 'border-white/30',
    description: 'Explore everything',
  },
  Food: {
    icon: '🍴',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-400/40',
    description: 'Restaurants, cafés & bars',
  },
  Attractions: {
    icon: '🏛️',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/40',
    description: 'Museums, parks & landmarks',
  },
  Transport: {
    icon: '🚇',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-400/40',
    description: 'Metro, buses & ferries',
  },
};
