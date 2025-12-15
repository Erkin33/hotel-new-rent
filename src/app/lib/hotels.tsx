// src/lib/hotels.ts

export type Amenity = "wifi" | "pool" | "spa" | "breakfast";

export type Hotel = {
  id: string;
  country: string;
  name: string;
  address: string;
  stars: 1 | 2 | 3 | 4 | 5;
  rating: number; // 0..10
  reviews: number;
  price: number; // $ per night
  image: string;
  amenities: Amenity[];
  gallery?: string[];
};

export const HOTELS: Hotel[] = [
  // Singapore
  {
    id: "sg-fullerton",
    country: "Singapore",
    name: "The Fullerton Hotel Singapore",
    address: "1 Fullerton Square, Singapore",
    stars: 5,
    rating: 9.5,
    reviews: 1200,
    price: 2024,
    image: "/Hotels/hotelN1.webp",
    amenities: ["wifi", "breakfast", "spa"],
    gallery: ["/Hotels/hotelN1.webp", "/TopRated/The-Spectator-Hotel.svg", "/TopRated/Marseilles-Beachfront-Hotel.svg"],
  },
  {
    id: "sg-rosewood",
    country: "Singapore",
    name: "Rosewood Mayakoba",
    address: "Beachfront Ave, Singapore",
    stars: 5,
    rating: 9.1,
    reviews: 980,
    price: 1790,
    image: "/Hotels/hotelN2.jpg",
    amenities: ["wifi", "pool", "spa"],
    gallery: ["/Hotels/hotelN2.jpg", "/TopRated/Waldorf-Astoria-Los-Cabos-Pedregal.svg"],
  },
  {
    id: "sg-emma",
    country: "Singapore",
    name: "Hotel Emma",
    address: "Downtown, Singapore",
    stars: 4,
    rating: 8.8,
    reviews: 650,
    price: 880,
    image: "/TopRated/Deco-Boutique-Hotel.svg",
    amenities: ["wifi", "breakfast"],
    gallery: ["/TopRated/Deco-Boutique-Hotel.svg"],
  },
  // Dubai
  {
    id: "dubai-ocean",
    country: "Dubai",
    name: "Palm Ocean Resort",
    address: "Palm Jumeirah, Dubai, UAE",
    stars: 5,
    rating: 9.1,
    reviews: 1100,
    price: 1900,
    image: "/TopRated/Marseilles-Beachfront-Hotel.svg",
    amenities: ["wifi", "pool", "spa"],
  },
  {
    id: "dubai-city",
    country: "Dubai",
    name: "Downtown City Hotel",
    address: "Downtown Dubai, UAE",
    stars: 4,
    rating: 8.6,
    reviews: 570,
    price: 960,
    image: "/TopRated/Waldorf-Astoria-Los-Cabos-Pedregal.svg",
    amenities: ["wifi", "breakfast"],
  },
  // Tokyo
  {
    id: "tokyo-urban",
    country: "Tokyo",
    name: "Urban Boutique Tokyo",
    address: "Shinjuku, Tokyo, Japan",
    stars: 4,
    rating: 8.9,
    reviews: 700,
    price: 1050,
    image: "/Category/Kayakapi-Premium.svg",
    amenities: ["wifi", "breakfast"],
  },
  {
    id: "tokyo-palace",
    country: "Tokyo",
    name: "Imperial Palace View",
    address: "Chiyoda City, Tokyo",
    stars: 5,
    rating: 9.4,
    reviews: 1150,
    price: 2300,
    image: "/TopRated/The-Spectator-Hotel.svg",
    amenities: ["wifi", "spa", "breakfast"],
  },
  // Paris
  {
    id: "paris-raphael",
    country: "Paris",
    name: "Hôtel Raphael",
    address: "Avenue Kléber, Paris, France",
    stars: 5,
    rating: 9.2,
    reviews: 740,
    price: 2100,
    image: "/Category/Hotel-Raphael.svg",
    amenities: ["wifi", "spa", "breakfast"],
  },
  // New York
  {
    id: "nyc-inn",
    country: "New York",
    name: "The Inn at Lost Creek (NYC)",
    address: "Chelsea, New York",
    stars: 4,
    rating: 8.5,
    reviews: 680,
    price: 990,
    image: "/Hotels/hotelN3.jpg",
    amenities: ["wifi", "pool"],
  },
  // Istanbul
  {
    id: "ist-old",
    country: "Istanbul",
    name: "Old City Boutique",
    address: "Sultanahmet, Istanbul, TR",
    stars: 4,
    rating: 8.7,
    reviews: 610,
    price: 520,
    image: "/Hotels/hotelN5.jpg",
    amenities: ["wifi", "breakfast"],
  },
];

export const getHotelById = (id: string) => HOTELS.find((h) => h.id === id);

export const fmtUSD = (n: number) => `$${n.toLocaleString()}`;

export type RoomType = {
  key: "standard" | "deluxe" | "suite";
  name: string;
  mult: number; // price multiplier
  perks: readonly string[];
  beds: string;
  /** Optional badge like “Popular”, “Best value” */
  badge?: string;
};

export const ROOM_TYPES: readonly RoomType[] = [
  {
    key: "standard",
    name: "Standard",
    mult: 1,
    perks: ["Free Wi-Fi", "City view"],
    beds: "1 Queen",
  },
  {
    key: "deluxe",
    name: "Deluxe",
    mult: 1.25,
    perks: ["Free Wi-Fi", "Breakfast included", "Partial sea view"],
    beds: "1 King",
    badge: "Popular",
  },
  {
    key: "suite",
    name: "Suite",
    mult: 1.6,
    perks: ["Free Wi-Fi", "Breakfast included", "Sea view", "Lounge access"],
    beds: "2 King",
    badge: "Best value",
  },
] as const;
