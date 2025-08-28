"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getHotelById, ROOM_TYPES, fmtUSD } from "@/app/lib/hotels";

/* ================= helpers / types ================= */
type SheetProps = { hotelId: string; onClose: () => void; defaultRoomKey?: (typeof ROOM_TYPES)[number]["key"] };

const todayIso = () => new Date().toISOString().slice(0, 10);
const addDaysIso = (d = 1) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};
const nightsBetween = (a: string, b: string) =>
  Math.max(1, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / (24 * 3600 * 1000)));

// простой детерминированный PRNG, чтобы «рандом» был стабильным на отель
function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seedFromString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
};

/* ================= main component ================= */
export default function HotelDetailsClient({
  id,
}: {
  id: string;
}) {
  const hotel = getHotelById(id);

  if (!hotel) {
    return (
      <div className="px-6 lg:px-[150px] py-20">
        <h1 className="text-2xl font-bold">Hotel not found</h1>
        <p className="mt-2">
          Go back to{" "}
          <Link href="/hotels" className="text-blue-600 underline">
            search
          </Link>
          .
        </p>
      </div>
    );
  }

  /* --------- UI state --------- */
  const [sheetOpen, setSheetOpen] = useState<{ open: boolean; roomKey?: (typeof ROOM_TYPES)[number]["key"] }>({
    open: false,
  });
  const [tab, setTab] = useState<"overview" | "amenities" | "rooms" | "policies" | "reviews" | "location">("overview");
  const [fav, setFav] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("favorites") || "[]";
      return JSON.parse(raw).includes(hotel.id);
    } catch {
      return false;
    }
  });

  const toggleFav = () => {
    try {
      const raw = localStorage.getItem("favorites") || "[]";
      const arr: string[] = JSON.parse(raw);
      const next = arr.includes(hotel.id) ? arr.filter((x) => x !== hotel.id) : [...arr, hotel.id];
      localStorage.setItem("favorites", JSON.stringify(next));
      setFav(next.includes(hotel.id));
    } catch {
      setFav((v) => !v);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${hotel.name}, ${hotel.address}`);
      alert("Address copied ✔");
    } catch {
      // no-op
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: hotel.name, text: "Check this hotel", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied ✔");
      }
    } catch {
      // ignore
    }
  };

  /* --------- gallery (микс из ассетов) --------- */
  const gallery = useMemo(() => {
    const extra = [
      "/Hotels/hotelN2.jpg",
      "/Hotels/hotelN3.jpg",
      "/Hotels/hotelN5.jpg",
      "/TopRated/Marseilles-Beachfront-Hotel.svg",
      "/TopRated/Waldorf-Astoria-Los-Cabos-Pedregal.svg",
      "/TopRated/The-Spectator-Hotel.svg",
      "/Category/Hotel-Best-Auto-Hogar.svg",
      "/Category/Kayakapi-Premium.svg",
    ];
    const set = Array.from(new Set([hotel.image, ...(hotel.gallery ?? []), ...extra])).slice(0, 8);
    return set;
  }, [hotel.image, hotel.gallery]);

  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });

  /* --------- highlights / nearby / rating breakdown --------- */
  const highlights = [
    "Free cancellation",
    "No prepayment",
    "Breakfast available",
    "Great for two travelers",
    "24/7 front desk",
    "Top-rated location",
  ];

  const nearbyByCity: Record<string, string[]> = {
    Singapore: ["Merlion Park – 400m", "Chinatown – 1.2km", "Marina Bay Sands – 1.5km", "Singapore Flyer – 2.1km"],
    Dubai: ["Palm Jumeirah – 0.8km", "Dubai Marina – 2.4km", "Burj Al Arab – 4.8km", "The Walk JBR – 3.1km"],
    Tokyo: ["Shinjuku Gyoen – 900m", "Meiji Jingu – 2.2km", "Tokyo Tower – 4.0km", "Imperial Palace – 4.5km"],
    Paris: ["Arc de Triomphe – 350m", "Champs-Élysées – 700m", "Eiffel Tower – 2.2km", "Louvre – 3.1km"],
    "New York": ["High Line – 650m", "Times Square – 1.9km", "Central Park – 3.5km", "Brooklyn Bridge – 5.3km"],
    Istanbul: ["Blue Mosque – 600m", "Hagia Sophia – 800m", "Grand Bazaar – 1.2km", "Galata Tower – 3.2km"],
  };
  const nearby = nearbyByCity[hotel.country] ?? ["City center – 500m", "Main station – 1.2km", "Old town – 1.7km"];

  const ratingBreakdown = [
    ["Cleanliness", 9.4],
    ["Location", 9.6],
    ["Comfort", 9.2],
    ["Facilities", 9.1],
    ["Value", 8.9],
    ["Wi-Fi", 9.0],
  ] as const;

  return (
    <main className="w-full px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[6px] pb-16">
      {/* HERO: gallery */}
      <section className="pt-[96px] sm:pt-[112px] lg:pt-[126px]">
        <div className="grid grid-cols-12 gap-3 rounded-xl overflow-hidden">
          <button
            className="col-span-12 md:col-span-7 lg:col-span-8 relative h-[220px] md:h-[360px] lg:h-[420px] group"
            onClick={() => setLightbox({ open: true, idx: 0 })}
            aria-label="Open gallery"
          >
            <Image src={gallery[0]} alt={hotel.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <span className="absolute right-3 bottom-3 text-xs px-2 py-1 rounded bg-black/60 text-white">
              {gallery.length} photos
            </span>
          </button>

          <div className="hidden md:grid md:col-span-5 lg:col-span-4 grid-rows-2 gap-3">
            {gallery.slice(1, 3).map((src, i) => (
              <button
                key={i}
                className="relative h-[175px] lg:h-[206px] rounded-lg overflow-hidden group"
                onClick={() => setLightbox({ open: true, idx: i + 1 })}
                aria-label="Open gallery image"
              >
                <Image src={src} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
        {/* thumbs row */}
        <div className="mt-2 hidden md:flex gap-2">
          {gallery.slice(3, 8).map((src, i) => (
            <button
              key={src}
              className="relative h-[70px] w-[110px] rounded-md overflow-hidden group"
              onClick={() => setLightbox({ open: true, idx: i + 3 })}
            >
              <Image src={src} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* title + CTA card */}
      <section className="mt-5 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-[22px] sm:text-[24px] lg:text-[28px] font-bold text-[#23284C]">{hotel.name}</h1>
            <span className="inline-flex items-center rounded-md bg-green-600 text-white text-xs px-1.5 py-0.5 mt-[4px]">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-sm text-black/60 mt-[6px]">{hotel.reviews} reviews</span>
          </div>
          <div className="mt-1 text-sm text-black/70 flex items-center gap-3 flex-wrap">
            <span>{hotel.address}</span>
            <button onClick={copyAddress} className="text-[#1E2352] underline underline-offset-2">
              Copy address
            </button>
            <span className="mx-1 text-black/20">•</span>
            <button onClick={share} className="text-[#1E2352] underline underline-offset-2">
              Share
            </button>
            <span className="mx-1 text-black/20">•</span>
            <button
              onClick={toggleFav}
              className={`px-2 py-1 rounded border ${fav ? "bg-rose-50 border-rose-200 text-rose-700" : "border-black/15"}`}
            >
              {fav ? "♥ Saved" : "♡ Save"}
            </button>
          </div>

          {/* tabs */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto text-sm">
            {[
              ["overview", "Overview"],
              ["amenities", "Amenities"],
              ["rooms", "Rooms"],
              ["policies", "Policies"],
              ["reviews", "Reviews"],
              ["location", "Location"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k as any)}
                className={[
                  "px-3 py-2 rounded-md border",
                  tab === k ? "bg-[#1E2352] text-white border-[#1E2352]" : "bg-white border-black/10",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:w-[340px]">
          <div className="rounded-xl border border-black/10 p-4 bg-white shadow-sm">
            <div className="text-sm text-black/70">Starting from</div>
            <div className="text-2xl font-bold text-[#FEBB02]">{fmtUSD(hotel.price)}</div>
            <p className="text-xs text-black/60">Price per night, before taxes</p>

            <button
              className="mt-3 w-full h-10 rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90"
              onClick={() => setSheetOpen({ open: true })}
            >
              Book availability
            </button>
            <p className="mt-2 text-[11px] text-black/60 text-center">Free cancellation • No prepayment</p>

            {/* small summary */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-black/10 p-2">
                <div className="text-[11px] text-black/60">Stars</div>
                <div className="font-semibold">{hotel.stars}★</div>
              </div>
              <div className="rounded-md border border-black/10 p-2">
                <div className="text-[11px] text-black/60">Country</div>
                <div className="font-semibold">{hotel.country}</div>
              </div>
              <div className="rounded-md border border-black/10 p-2">
                <div className="text-[11px] text-black/60">Wi-Fi</div>
                <div className="font-semibold">{hotel.amenities.includes("wifi") ? "Free" : "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* content by tabs */}
      {tab === "overview" && (
        <OverviewTab hotelId={hotel.id} country={hotel.country} highlights={highlights} nearby={nearby} ratingBreakdown={ratingBreakdown} />
      )}

      {tab === "amenities" && (
        <AmenitiesTab amenities={hotel.amenities} />
      )}

      {tab === "rooms" && (
        <RoomsTab
          basePrice={hotel.price}
          onSelect={(roomKey) => setSheetOpen({ open: true, roomKey })}
        />
      )}

      {tab === "policies" && <PoliciesTab />}

      {tab === "reviews" && <ReviewsTab ratingBreakdown={ratingBreakdown} />}

      {tab === "location" && <LocationTab seedKey={hotel.id} address={hotel.address} />}

      {/* booking sheet */}
      {sheetOpen.open && (
        <BookSheet
          hotelId={hotel.id}
          onClose={() => setSheetOpen({ open: false })}
          defaultRoomKey={sheetOpen.roomKey}
        />
      )}

      {/* lightbox */}
      {lightbox.open && (
        <Lightbox images={gallery} idx={lightbox.idx} onClose={() => setLightbox({ open: false, idx: 0 })} />
      )}
    </main>
  );
}

/* ===================== Tabs ===================== */
function OverviewTab({
  hotelId,
  country,
  highlights,
  nearby,
  ratingBreakdown,
}: {
  hotelId: string;
  country: string;
  highlights: string[];
  nearby: string[];
  ratingBreakdown: readonly (readonly [string, number])[];
}) {
  return (
    <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* left: long overview */}
      <div className="lg:col-span-2 rounded-xl border border-black/10 bg-white p-4">
        <h3 className="font-semibold text-[#1A1E43]">Overview</h3>
        <p className="mt-2 text-sm text-black/75">
          Welcome to our property — a refined haven in the heart of {country}. Expect warm service, smart design and
          thoughtful touches that make business trips and city breaks equally smooth. Rooms are quiet, beds are dreamy,
          showers powerful, and Wi-Fi fast. Most room types include flexible cancellation and no prepayment.
        </p>
        <p className="mt-2 text-sm text-black/75">
          Start your day with a generous breakfast, then explore the neighborhood: cafés, museums and parks are steps
          away. Evenings bring a soft buzz to the lobby bar while the spa & pool stay open late. Sustainability matters:
          we limit plastic, use renewable energy and support local suppliers.
        </p>

        <h4 className="mt-4 font-semibold text-[#1A1E43]">Highlights</h4>
        <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
          {highlights.map((h) => (
            <li key={h} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {h}
            </li>
          ))}
        </ul>

        <h4 className="mt-4 font-semibold text-[#1A1E43]">What guests loved</h4>
        <div className="mt-2 grid sm:grid-cols-2 gap-3">
          {ratingBreakdown.map(([label, val]) => (
            <div key={label} className="rounded-md border border-black/10 p-3">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-semibold">{val.toFixed(1)}</span>
              </div>
              <div className="mt-2 h-2 rounded bg-black/10 overflow-hidden">
                <div className="h-full bg-[#1E2352]" style={{ width: `${Math.min(100, (val / 10) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* right: nearby list */}
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <h3 className="font-semibold text-[#1A1E43]">Nearby</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {nearby.map((n) => (
            <li key={n} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB02]" />
              {n}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold text-[#1A1E43]">Good to know</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li>Check-in from 3:00 PM • Check-out until 12:00 PM</li>
          <li>Children of any age are welcome</li>
          <li>Pets are allowed on request (fees may apply)</li>
          <li>Accepted cards: Visa, MasterCard, AmEx</li>
        </ul>
      </div>
    </section>
  );
}

function AmenitiesTab({ amenities }: { amenities: string[] }) {
  const groups: Record<string, string[]> = {
    Essentials: ["24/7 front desk", "Elevator", "Air conditioning", "Luggage storage"],
    Wellness: ["Spa", "Sauna", "Indoor pool", "Fitness center"],
    Dining: ["Bar & Lounge", "Restaurant", "Room service", "Breakfast options"],
    Business: ["Meeting rooms", "Fast Wi-Fi", "Printing service", "Co-working corner"],
  };

  // добавим реальные удобства отеля первой группой
  groups["Included"] = amenities.map((a) => a[0].toUpperCase() + a.slice(1));

  return (
    <section className="mt-6 rounded-xl border border-black/10 bg-white p-4">
      <h3 className="font-semibold text-[#1A1E43]">Amenities</h3>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groups).map(([title, list]) => (
          <div key={title} className="rounded-md border border-black/10 p-3">
            <div className="font-semibold text-[#1A1E43]">{title}</div>
            <ul className="mt-2 space-y-1 text-sm">
              {list.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoomsTab({
  basePrice,
  onSelect,
}: {
  basePrice: number;
  onSelect: (roomKey: (typeof ROOM_TYPES)[number]["key"]) => void;
}) {
  return (
    <section className="mt-6 grid gap-4">
      {ROOM_TYPES.map((rt) => {
        const ppn = Math.round(basePrice * rt.mult);
        return (
          <article
            key={rt.key}
            className="rounded-xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* left image (placeholder style) */}
              <div className="w-full md:w-[285px] md:shrink-0">
                <div
                  className="w-full h-[200px] rounded-lg bg-center bg-cover"
                  style={{
                    backgroundImage:
                      rt.key === "suite"
                        ? `url(/TopRated/The-Spectator-Hotel.svg)`
                        : rt.key === "deluxe"
                        ? `url(/TopRated/Waldorf-Astoria-Los-Cabos-Pedregal.svg)`
                        : `url(/Hotels/hotelN2.jpg)`,
                  }}
                />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[#23284C] text-[18px] font-bold">{rt.name}</div>
                      {("badge" in rt && rt.badge) && (
                        <span className="inline-flex items-center rounded bg-emerald-600 text-white text-xs px-1.5 py-0.5">
                          {rt.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-black/70">{rt.beds} • {rt.perks.join(" • ")}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-black/60">From</div>
                    <div className="text-[#F59E0B] text-[20px] font-bold">{fmtUSD(ppn)}</div>
                    <div className="text-[11px] text-black/60">per night</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <ul className="text-sm text-black/75 list-disc ps-5">
                    <li>Free cancellation until 24h before arrival</li>
                    <li>No prepayment needed — pay at the property</li>
                    <li>Breakfast available at check-in</li>
                  </ul>
                  <button
                    className="h-9 px-5 rounded-md bg-[#1E2352] text-white text-[14px] font-semibold hover:opacity-90 w-full sm:w-auto"
                    onClick={() => onSelect(rt.key)}
                  >
                    Select room
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function PoliciesTab() {
  return (
    <section className="mt-6 grid lg:grid-cols-2 gap-4">
      {[
        ["Check-in / Check-out", "Check-in from 15:00 • Check-out until 12:00. Early check-in subject to availability."],
        ["Children & Extra beds", "Children of any age are welcome. Extra beds upon request (additional fees may apply)."],
        ["Pets", "Pets are allowed on request. Charges may be applicable."],
        ["Cancellation", "Most rates offer free cancellation until 24 hours before arrival. Non-refundable deals also available."],
        ["Payments", "Visa, MasterCard, American Express. Cash accepted at the property."],
        ["Smoking", "Non-smoking throughout. Designated outdoor areas available."],
      ].map(([title, text]) => (
        <div key={title} className="rounded-xl border border-black/10 bg-white p-4">
          <div className="font-semibold text-[#1A1E43]">{title}</div>
          <p className="mt-2 text-sm text-black/75">{text}</p>
        </div>
      ))}
    </section>
  );
}

function ReviewsTab({ ratingBreakdown }: { ratingBreakdown: readonly (readonly [string, number])[] }) {
  const sample = [
    { name: "Olivia", text: "Amazing location and super comfy beds. Staff were lovely.", score: 9.4 },
    { name: "Mateo", text: "Quiet room, fast Wi-Fi, tasty breakfast. Will return!", score: 9.1 },
    { name: "Aisha", text: "Lobby bar is great. Spa a bit crowded in the evening.", score: 8.8 },
  ];
  return (
    <section className="mt-6 grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 rounded-xl border border-black/10 bg-white p-4">
        <div className="font-semibold text-[#1A1E43]">Scores</div>
        <div className="mt-2 grid gap-2">
          {ratingBreakdown.map(([l, v]) => (
            <div key={l} className="text-sm">
              <div className="flex justify-between">
                <span>{l}</span>
                <span className="font-semibold">{v.toFixed(1)}</span>
              </div>
              <div className="mt-1 h-2 rounded bg-black/10 overflow-hidden">
                <div className="h-full bg-[#1E2352]" style={{ width: `${(v / 10) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 grid gap-4">
        {sample.map((r) => (
          <div key={r.name} className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[#1A1E43]">{r.name}</div>
              <span className="inline-flex items-center rounded bg-green-600 text-white text-xs px-1.5 py-0.5">
                {r.score.toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-sm text-black/75">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LocationTab({ seedKey, address }: { seedKey: string; address: string }) {
  const rand = mulberry32(seedFromString(seedKey));
  const pins = Array.from({ length: 6 }).map(() => ({
    x: Math.round(8 + rand() * 84), // 8..92%
    y: Math.round(10 + rand() * 76), // 10..86%
  }));

  return (
    <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-xl border border-black/10 bg-white p-4">
        <h3 className="font-semibold text-[#1A1E43]">Location</h3>
        <p className="text-sm text-black/75 mt-1">{address}</p>

        {/* псевдо-map (градиент + пины) */}
        <div className="mt-3 relative h-[360px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1025] via-[#121a3d] to-[#0b1025]" />
          {pins.map((p, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-full text-white"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden
            >
              <div className="w-3 h-3 rounded-full bg-[#FEBB02] shadow-[0_0_0_3px_rgba(254,187,2,0.25)]" />
              <div className="w-[2px] h-3 mx-auto bg-[#FEBB02]" />
            </div>
          ))}
          <div className="absolute left-3 bottom-3 text-[11px] text-white/70">Map • illustrative only</div>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <h3 className="font-semibold text-[#1A1E43]">Transport</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li>Metro station — {Math.round(3 + rand() * 5)} min walk</li>
          <li>Airport — {Math.round(18 + rand() * 40)} min drive</li>
          <li>Central station — {Math.round(8 + rand() * 15)} min drive</li>
          <li>Old town — {Math.round(10 + rand() * 20)} min walk</li>
        </ul>
      </div>
    </section>
  );
}

/* ===================== Lightbox ===================== */
function Lightbox({ images, idx, onClose }: { images: string[]; idx: number; onClose: () => void }) {
  const [i, setI] = useState(idx);
  const prev = useCallback(() => setI((v) => (v - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setI((v) => (v + 1) % images.length), [images.length]);

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-5xl aspect-[16/9]">
          <Image src={images[i]} alt="" fill className="object-contain" />
        </div>
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 h-10 px-3 rounded-md bg-white/10 text-white border border-white/30 hover:bg-white/20"
          onClick={prev}
          aria-label="Prev"
        >
          ‹
        </button>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 h-10 px-3 rounded-md bg-white/10 text-white border border-white/30 hover:bg-white/20"
          onClick={next}
          aria-label="Next"
        >
          ›
        </button>
        <button
          className="absolute right-6 top-6 h-9 px-3 rounded-md bg-white text-[#1E2352] font-semibold"
          onClick={onClose}
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ============== Booking Sheet ============== */
function BookSheet({ hotelId, onClose, defaultRoomKey }: SheetProps) {
  const router = useRouter();
  const hotel = getHotelById(hotelId)!;

  const defaultRoom =
    ROOM_TYPES.find((r) => r.key === defaultRoomKey) ?? ROOM_TYPES[1]; // Deluxe

  const [checkIn, setCheckIn] = useState(todayIso());
  const [checkOut, setCheckOut] = useState(addDaysIso(1));
  const [roomType, setRoomType] = useState<(typeof ROOM_TYPES)[number]>(defaultRoom);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const pricePerNight = Math.round(hotel.price * roomType.mult);
  const subtotal = pricePerNight * rooms * nights;

  const proceed = () => {
    const draft = {
      hotelId,
      checkIn,
      checkOut,
      nights,
      rooms,
      adults,
      children,
      roomKey: roomType.key,
      roomName: roomType.name,
      pricePerNight,
      subtotal,
    };
    try {
      localStorage.setItem("bookingDraft", JSON.stringify(draft));
    } catch {}

    const q = new URLSearchParams({
      hotelId,
      checkIn,
      checkOut,
      rooms: String(rooms),
      adults: String(adults),
      children: String(children),
      room: roomType.key,
    });
    router.push(`/booking?${q.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-[95] flex" onClick={onClose} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="ml-auto relative h-full w-[min(100vw,480px)] bg-white shadow-2xl p-4 sm:p-5 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1E43]">Book availability</h3>
            <p className="text-xs text-black/60">{getHotelById(hotelId)?.name}</p>
          </div>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={onClose}>
            Close
          </button>
        </div>

        {/* dates */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-[#222243]">
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
            />
          </label>
          <label className="text-sm font-medium text-[#222243]">
            Check-out
            <input
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
            />
          </label>
        </div>

        {/* room types */}
        <div className="mt-4 grid gap-3">
          {ROOM_TYPES.map((rt) => {
            const active = rt.key === roomType.key;
            const ppn = Math.round(hotel.price * rt.mult);
            return (
              <label
                key={rt.key}
                className={[
                  "rounded-md border p-3 cursor-pointer transition",
                  active ? "border-[#1E2352] ring-2 ring-[#1E2352]/20" : "border-black/15 hover:border-black/25",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="room-type"
                      className="accent-[#1E2352]"
                      checked={active}
                      onChange={() => setRoomType(rt)}
                    />
                    <span className="font-semibold text-[#23284C]">{rt.name}</span>
                    {("badge" in rt && rt.badge) && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-600 text-white">{rt.badge}</span>
                    )}
                  </span>
                  <span className="text-sm text-[#FEBB02] font-bold">{fmtUSD(ppn)}/night</span>
                </div>
                <div className="mt-1 text-xs text-black/70">
                  {rt.beds} • {rt.perks.join(" • ")}
                </div>
              </label>
            );
          })}
        </div>

        {/* counters */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Counter label="Rooms" value={rooms} setValue={setRooms} />
          <Counter label="Adults" value={adults} setValue={setAdults} min={1} />
          <Counter label="Children" value={children} setValue={setChildren} min={0} />
        </div>

        <div className="mt-4 rounded-lg border border-black/10 p-3 bg-[#F9FAFB]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/70">
              {rooms} room{rooms > 1 ? "s" : ""} • {nights} night{nights > 1 ? "s" : ""} • {roomType.name}
            </span>
            <span className="font-bold text-[#1E2352]">{fmtUSD(pricePerNight * rooms * nights)}</span>
          </div>
          <p className="mt-1 text-[11px] text-black/60">Taxes calculated at checkout</p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button className="h-10 rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90" onClick={proceed}>
            Continue to booking
          </button>
          <p className="text-[11px] text-center text-black/60">You’ll be redirected to the booking form</p>
        </div>
      </div>
    </div>
  );
}

/* small counter */
function Counter({
  label,
  value,
  setValue,
  min = 1,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min?: number;
}) {
  return (
    <div className="rounded-md border border-black/15 p-3">
      <div className="text-xs text-black/60">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-md border grid place-items-center hover:bg-black/5"
          onClick={() => setValue(Math.max(min, value - 1))}
          aria-label={`decrease ${label}`}
        >
          −
        </button>
        <div className="w-10 text-center font-semibold">{value}</div>
        <button
          className="w-8 h-8 rounded-md border grid place-items-center hover:bg-black/5"
          onClick={() => setValue(value + 1)}
          aria-label={`increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
