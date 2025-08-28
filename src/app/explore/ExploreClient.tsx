"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* ================== Demo data ================== */
type Chip = { key: string; label: string };
const CHIPS: Chip[] = [
  { key: "beach", label: "Beachfront" },
  { key: "city", label: "City breaks" },
  { key: "spa", label: "Spa / Wellness" },
  { key: "family", label: "Family" },
  { key: "romance", label: "Romantic" },
  { key: "business", label: "Business" },
];

type Destination = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  priceFrom: number;
  tag: Chip["key"][];
  href: string;
};

const DESTS: Destination[] = [
  {
    id: "tokyo-rooftops",
    title: "Tokyo Rooftops",
    subtitle: "Skyline suites & late-night ramen",
    img: "/TopRated/The-Spectator-Hotel.svg",
    priceFrom: 980,
    tag: ["city", "business", "romance"],
    href: "/hotels?country=Tokyo",
  },
  {
    id: "dubai-beach",
    title: "Palm Dubai",
    subtitle: "Private beach & yacht rentals",
    img: "/TopRated/Marseilles-Beachfront-Hotel.svg",
    priceFrom: 1900,
    tag: ["beach", "spa", "romance"],
    href: "/hotels?country=Dubai",
  },
  {
    id: "paris-classic",
    title: "Paris Classics",
    subtitle: "Left Bank cafés & art walks",
    img: "/Category/Hôtel-Raphael.svg",
    priceFrom: 2100,
    tag: ["city", "romance"],
    href: "/hotels?country=Paris",
  },
  {
    id: "nyc-downtown",
    title: "New York Downtown",
    subtitle: "Chelsea galleries & jazz nights",
    img: "/Hotels/hotelN3.jpg",
    priceFrom: 990,
    tag: ["city", "business"],
    href: "/hotels?country=New%20York",
  },
  {
    id: "istanbul-old",
    title: "Istanbul Old City",
    subtitle: "Bazaars, baths & Bosphorus",
    img: "/Hotels/hotelN5.jpg",
    priceFrom: 520,
    tag: ["city", "spa", "family"],
    href: "/hotels?country=Istanbul",
  },
  {
    id: "singapore-marina",
    title: "Singapore Marina",
    subtitle: "Gardens by the Bay & hawkers",
    img: "/Hotels/hotelN1.webp",
    priceFrom: 2024,
    tag: ["city", "spa", "business"],
    href: "/hotels?country=Singapore",
  },
];

/* ================== Page ================== */
export default function ExploreClient() {
  const [active, setActive] = useState<string[]>([]);
  const toggle = (k: string) =>
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  const clearAll = () => setActive([]);

  const filtered = useMemo(() => {
    if (!active.length) return DESTS;
    return DESTS.filter((d) => active.every((k) => d.tag.includes(k as any)));
  }, [active]);

  return (
    <main className="px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[6px] -mt-[140px] pb-16">
      <Hero />

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT — фильтры + грид направлений */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Chips active={active} onToggle={toggle} onClear={clearAll} />
          <DiscoverGrid items={filtered} />
        </div>

        {/* RIGHT — сайдбар */}
        <div className="lg:col-span-1 grid gap-5">
          <Trending />
          <TipsCard />
          <MiniMap />
        </div>
      </section>
    </main>
  );
}

/* ================== Sections ================== */
function Hero() {
  return (
    <section className="relative rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-0">
        <Image src="/Category/Hotel-Best-Auto-Hogar.svg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1E43]/90 via-[#1A1E43]/50 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-10 lg:p-12 text-white max-w-[720px]">
        <div className="text-xs uppercase tracking-wider text-white/80">Explore</div>
        <h1 className="mt-1 text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-tight">
          Hand-picked stays, curated by mood
        </h1>
        <p className="mt-2 text-white/90">
          Filter by vibe, not only by stars. Mix beach mornings with city nights, spa days with rooftop views.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/hotels?country=Tokyo" className="h-11 rounded-lg bg-white text-[#1E2352] grid place-items-center font-semibold hover:opacity-90">
            Tokyo
          </Link>
          <Link href="/hotels?country=Dubai" className="h-11 rounded-lg bg-white/10 backdrop-blur border border-white/20 grid place-items-center font-semibold hover:bg-white/20">
            Dubai
          </Link>
          <Link href="/hotels?country=Paris" className="h-11 rounded-lg bg-white/10 backdrop-blur border border-white/20 grid place-items-center font-semibold hover:bg-white/20">
            Paris
          </Link>
        </div>
      </div>
    </section>
  );
}

function Chips({
  active,
  onToggle,
  onClear,
}: {
  active: string[];
  onToggle: (k: string) => void;
  onClear?: () => void;
}) {
  const clear = () => {
    const el = document.activeElement as HTMLElement | null;
    if (el && typeof el.blur === "function") el.blur();
    onClear?.();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CHIPS.map((c) => {
        const on = active.includes(c.key);
        return (
          <button
            key={c.key}
            onClick={() => onToggle(c.key)}
            className={[
              "h-9 px-3 rounded-full border text-sm transition",
              on
                ? "bg-[#1E2352] text-white border-[#1E2352]"
                : "bg-white text-[#1E2352] border-black/15 hover:bg-black/5",
            ].join(" ")}
          >
            {c.label}
          </button>
        );
      })}

      {active.length > 0 && (
        <button
          onClick={() => onToggle(active[active.length - 1])}
          className="h-9 px-3 rounded-full text-sm border border-black/10 bg-white hover:bg-black/5"
          title="Undo last filter"
        >
          ⟲ Undo
        </button>
      )}

      {active.length > 0 && (
        <button
          onClick={clear}
          className="h-9 px-3 rounded-full text-sm border border-black/10 bg-white hover:bg-black/5"
          title="Clear all"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function DiscoverGrid({ items }: { items: Destination[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 p-8 text-center text-black/60">
        No matches for current filters.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((d) => (
        <DiscoverCard key={d.id} d={d} />
      ))}
    </div>
  );
}

function DiscoverCard({ d }: { d: Destination }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      className="group relative rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative h-[220px]">
        <Image src={d.img} alt={d.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-4 right-4 bottom-3 text-white">
          <div className="text-[12px] opacity-90">{d.subtitle}</div>
          <h3 className="text-lg font-extrabold leading-tight">{d.title}</h3>
        </div>

        <div
          className={[
            "absolute right-3 top-3 transition-all",
            hover ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
          ].join(" ")}
        >
          <div className="px-2 py-1 rounded-md bg-white/90 backdrop-blur text-[12px] font-semibold text-[#1E2352] shadow">
            from ${d.priceFrom}
          </div>
        </div>
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {d.tag.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-1 rounded-full text-[11px] bg-[#F5F6FA] text-[#1E2352] border border-black/10">
              {t}
            </span>
          ))}
        </div>
        <Link href={d.href} className="inline-flex items-center gap-1 text-[#1E2352] font-semibold hover:underline">
          Explore <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

/* =============== Trending =============== */
function Trending() {
  const items = [
    { t: "Best rooftops", s: "Tokyo · New York · Singapore", img: "/TopRated/The-Spectator-Hotel.svg" },
    { t: "Beachfront escapes", s: "Dubai · Miami · Bali", img: "/TopRated/Marseilles-Beachfront-Hotel.svg" },
    { t: "Historic districts", s: "Paris · Istanbul · Rome", img: "/Category/Hôtel-Raphael.svg" },
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % items.length), 3500);
    return () => window.clearInterval(id);
  }, [items.length]);

  return (
    <aside className="rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="relative h-[240px]">
        <Image src={items[i].img} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="text-sm opacity-90">Trending now</div>
          <div className="text-xl font-extrabold leading-tight">{items[i].t}</div>
          <div className="text-[12px] opacity-90">{items[i].s}</div>
        </div>
      </div>
      <div className="p-4 grid gap-2">
        <Link href="/hotels" className="h-10 rounded-lg bg-[#1E2352] text-white grid place-items-center font-semibold hover:opacity-90">
          Explore all
        </Link>
        <Link href="/services" className="h-10 rounded-lg border border-black/15 grid place-items-center font-semibold hover:bg-black/5">
          Build a bundle →
        </Link>
      </div>
    </aside>
  );
}

/* =============== Helpful Tips =============== */
function TipsCard() {
  const tips = [
    { t: "Book 28–35 days ahead", s: "Best balance of price & choice." },
    { t: "Mix & Match", s: "Split stay across two neighborhoods." },
    { t: "Off-peak perks", s: "Spa & dining credits mid-week." },
  ];
  return (
    <aside className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="font-semibold text-[#1A1E43]">Pro tips</h3>
      <ul className="mt-3 grid gap-2">
        {tips.map((x, idx) => (
          <li key={idx} className="rounded-md border border-black/10 p-3 bg-[#F9FAFB]">
            <div className="text-sm font-semibold text-[#1E2352]">{x.t}</div>
            <div className="text-[12px] text-black/70">{x.s}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* =============== Decorative Mini Map (client-only dots) =============== */
type Dot = { id: number; x: number; y: number; s: number; o: number };

function MiniMap() {
  // Изначально пустой список — одинаково на SSR и на первом клиентском рендере
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    // Генерим точки уже ПОСЛЕ монтирования — гидратации не мешаем
    const gen = (): Dot[] =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 6 + Math.random() * 10,
        o: 0.25 + Math.random() * 0.6,
      }));

    setDots(gen());
  }, []);

  return (
    <aside className="rounded-2xl border border-black/10 bg-[#0b1025] text-white overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <div className="text-sm font-semibold">Popular zones (mock)</div>
        <div className="text-[12px] opacity-70">Just a decorative heat map</div>
      </div>
      <div className="relative h-[220px]">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={10 * i} y1="0" x2={10 * i} y2="100" stroke="white" strokeWidth="0.3" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={10 * i} x2="100" y2={10 * i} stroke="white" strokeWidth="0.3" />
            ))}
          </svg>
        </div>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {dots.map((d) => (
            <circle key={d.id} cx={d.x} cy={d.y} r={d.s} fill="#FEBB02" opacity={d.o} />
          ))}
        </svg>
      </div>
      <div className="p-3 flex items-center justify-between">
        <Link href="/hotels" className="h-10 px-4 rounded-lg bg-white text-[#1E2352] grid place-items-center font-semibold hover:opacity-90">
          See stays →
        </Link>
        <span className="text-[12px] opacity-70">Updated just now</span>
      </div>
    </aside>
  );
}
