"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ========== helpers ========== */
const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function cls(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

/* ========== icons (inline SVG) ========== */
const Star = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
const Plane = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d="M10.5 21v-6l-8-5 1.5-1.5 8.5 3.5 7-8 2 2-8 7 3.5 8.5L15 21l-5-8.5" />
  </svg>
);
const Spark = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2 9 8l-6 3 6 3 3 6 3-6 6-3-6-3-3-6z" />
  </svg>
);
const Shield = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d="M12 3l7 4v6c0 4-2.5 7-7 8-4.5-1-7-4-7-8V7l7-4z" />
  </svg>
);
const Bed = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d="M3 7v10M21 7v10M3 12h18M7 12V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
  </svg>
);
const MapPin = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d="M12 21s7-5.33 7-12a7 7 0 0 0-14 0c0 6.67 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const Chat = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-3a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
  </svg>
);

/* ========== main client ========== */
export default function ServicesClient() {
  return (
    <main
      className={cls(
        "mx-auto w-full max-w-[1120px] overflow-x-clip",
        "px-4 sm:px-6 lg:px-8",
        // подтягиваем под цветную полосу (меньше на планшете/мобилке)
        "-mt-[140px] max-[1024px]:-mt-[120px] max-[480px]:-mt-[96px]",
        "pb-24"
      )}
    >
      <Hero />

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5 max-[1024px]:gap-4">
        <div className="lg:col-span-2 grid gap-5 max-[1024px]:gap-4">
          <Tabs />
          <BundleCalculator />
          <HowItWorks />
          <Testimonials />
          <FAQ />
        </div>

        <SideCTA />
      </section>

      <HelpWidget />
    </main>
  );
}

/* ========== HERO with counters ========== */
function Hero() {
  const counters = [
    { label: "Happy travelers", to: 128_000 },
    { label: "Partner hotels", to: 2_450 },
    { label: "Countries covered", to: 96 },
  ];
  const [vals, setVals] = useState(counters.map(() => 0));

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;

    const loop = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      setVals(counters.map((c) => Math.round(c.to * easeOutCubic(k))));
      if (k < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1E43] via-[#1f2a6b] to-[#0b1025] text-white p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.25)] max-[1024px]:rounded-xl max-[420px]:p-5">
      <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -left-10 -bottom-16 w-64 h-64 rounded-full bg-[#FEBB02]/10 blur-3xl" />

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-[26px] sm:text-[32px] lg:text-[40px] max-[1024px]:text-[24px] font-extrabold leading-tight">
            Services that turn every trip into a story
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl max-[1024px]:text-sm">
            From hand-picked stays to local experiences and 24/7 support — build your perfect journey
            with tools that work in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 h-11 max-[1024px]:h-10 px-5 rounded-xl bg-white text-[#1A1E43] font-bold hover:opacity-90"
            >
              <Spark className="w-5 h-5" />
              Start exploring
            </Link>
            <a
              href="#bundle"
              className="inline-flex items-center gap-2 h-11 max-[1024px]:h-10 px-5 rounded-xl border border-white/30 hover:bg-white/10"
            >
              <Star className="w-5 h-5" />
              Bundle & Save
            </a>
          </div>
        </div>

        {/* счётчики не ломают вёрстку на мобиле */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
          {counters.map((c, i) => (
            <div key={c.label} className="rounded-xl bg-white/10 p-3 sm:p-4 text-center">
              <div className="text-[20px] max-[400px]:text-[14px] sm:text-2xl font-extrabold">{vals[i].toLocaleString()}</div>
              <div className="text-[11px] sm:text-[12px] text-white/80">{c.label}</div>
              {/*  */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/* ========== TABS (services switcher) ========== */
function Tabs() {
  type TabKey = "stays" | "flights" | "experiences" | "support";
  const [tab, setTab] = useState<TabKey>("stays");

  const DATA: Record<
    TabKey,
    { icon: ReactNode; title: string; text: string; highlights: string[] }[]
  > = {
    stays: [
      { icon: <Bed className="w-6 h-6" />, title: "Curated stays", text: "Boutique hotels and designer apartments hand-picked by our editors.", highlights: ["Free Wi-Fi", "Flexible check-in", "No hidden fees"] },
      { icon: <MapPin className="w-6 h-6" />, title: "Best locations", text: "Live near landmarks, cafés and transport. Map filters make it easy.", highlights: ["Walk score 90+", "Neighborhood guides", "Verified photos"] },
      { icon: <Shield className="w-6 h-6" />, title: "安心 policies", text: "Clear rules and instant chat with the property to avoid surprises.", highlights: ["24h support", "Free cancellation*", "Price match"] },
    ],
    flights: [
      { icon: <Plane className="w-6 h-6" />, title: "Smart routing", text: "We stitch multi-airline routes with protected connections.", highlights: ["Hold fare 24h", "Carbon footprint", "Seat alerts"] },
      { icon: <Shield className="w-6 h-6" />, title: "Protection", text: "Delay? We rebook you automatically and handle the paperwork.", highlights: ["Auto rebooking", "Travel insurance", "WhatsApp updates"] },
      { icon: <Star className="w-6 h-6" />, title: "Miles & upgrades", text: "Collect miles across alliances and get upgrade suggestions.", highlights: ["Wallet sync", "Bid upgrades", "Status tracker"] },
    ],
    experiences: [
      { icon: <Spark className="w-6 h-6" />, title: "Local gems", text: "Food tours, rooftops, sunrise hikes — crafted by locals.", highlights: ["Small groups", "Instant confirm", "Cancel free*"] },
      { icon: <MapPin className="w-6 h-6" />, title: "City passes", text: "Bundle popular attractions to save up to 40%.", highlights: ["Skip-the-line", "Mobile tickets", "Audio guides"] },
      { icon: <Star className="w-6 h-6" />, title: "For teams", text: "Private events, meeting rooms and group transport.", highlights: ["Invoicing", "Concierge", "Volume pricing"] },
    ],
    support: [
      { icon: <Chat className="w-6 h-6" />, title: "24/7 humans", text: "Real agents with tools to fix — not chatbots.", highlights: ["Live chat", "Phone callback", "Multilingual"] },
      { icon: <Shield className="w-6 h-6" />, title: "Travel shield", text: "Coverage for delays, medical and baggage.", highlights: ["Instant claim", "No paper forms", "Closed-loop refunds"] },
      { icon: <MapPin className="w-6 h-6" />, title: "Smart itinerary", text: "One timeline for flights, stays and activities with offline access.", highlights: ["Share with friends", "Calendar sync", "Expense export"] },
    ],
  };

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[420px]:p-3">
      <div className="flex flex-wrap gap-2">
        {(["stays", "flights", "experiences", "support"] as TabKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cls(
              "h-10 max-[420px]:h-9 px-4 rounded-lg border text-sm font-semibold transition",
              tab === k
                ? "bg-[#1E2352] text-white border-[#1E2352]"
                : "bg-white hover:bg-black/5 border-black/10 text-[#1E2352]"
            )}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {DATA[tab].map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-black/10 p-4 max-[420px]:p-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1E2352]/10 text-[#1E2352]">
              {c.icon}
            </div>
            <h3 className="mt-2 font-semibold text-[#1A1E43]">{c.title}</h3>
            <p className="mt-1 text-sm text-black/70">{c.text}</p>
            <ul className="mt-2 space-y-1 text-sm text-black/75">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========== BUNDLE & SAVE calculator ========== */
function BundleCalculator() {
  const [nights, setNights] = useState(3);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [addons, setAddons] = useState({
    pickup: true,
    breakfast: true,
    spa: false,
    membership: false,
  });

  const baseNight = 220; // базовая цена за ночь за номер
  const addPrices = { pickup: 35, breakfast: 18, spa: 60 };

  const addCount = (["pickup", "breakfast", "spa"] as const).reduce(
    (acc, k) => acc + (addons[k] ? 1 : 0),
    0
  );

  const subtotal = rooms * nights * baseNight;
  const addonsCost =
    (addons.pickup ? addPrices.pickup : 0) * rooms +
    (addons.breakfast ? addPrices.breakfast : 0) * guests * nights +
    (addons.spa ? addPrices.spa : 0) * guests;

  // скидки: 2+ аддона = 10%, 3 аддона = 15%, membership даёт ещё 5%
  const tierDisc = addCount >= 3 ? 0.15 : addCount >= 2 ? 0.1 : 0;
  const memberDisc = addons.membership ? 0.05 : 0;

  const preTotal = subtotal + addonsCost;
  const discount = Math.round(preTotal * (tierDisc + memberDisc));
  const taxes = Math.round((preTotal - discount) * 0.12);
  const total = preTotal - discount + taxes;

  const setAddon = (k: keyof typeof addons) =>
    setAddons((s) => ({ ...s, [k]: !s[k] }));

  return (
    <section id="bundle" className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[420px]:p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">Bundle & Save</h2>
        <Link
          href="/hotels"
          className="h-10 px-4 flex items-center rounded-lg bg-[#1E2352] text-white font-semibold hover:opacity-90 max-[420px]:h-9"
        >
          Start booking
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5 max-[1024px]:gap-4">
        {/* controls */}
        <div className="grid gap-3 max-[1024px]:gap-2.5">
          <div className="grid grid-cols-3 gap-3 max-[420px]:grid-cols-2">
            <Counter label="Nights" value={nights} setValue={setNights} min={1} />
            <Counter label="Rooms" value={rooms} setValue={setRooms} min={1} />
            <Counter label="Guests" value={guests} setValue={setGuests} min={1} />
          </div>

          <div className="rounded-lg border border-black/10 p-3 max-[420px]:p-2.5">
            <div className="text-sm font-semibold text-[#1A1E43]">Add-ons</div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Toggle
                checked={addons.pickup}
                onChange={() => setAddon("pickup")}
                title="Airport pickup"
                hint={`${fmtUSD(addPrices.pickup)} / room`}
              />
              <Toggle
                checked={addons.breakfast}
                onChange={() => setAddon("breakfast")}
                title="Breakfast"
                hint={`${fmtUSD(addPrices.breakfast)} / guest / night`}
              />
              <Toggle
                checked={addons.spa}
                onChange={() => setAddon("spa")}
                title="Spa access"
                hint={`${fmtUSD(addPrices.spa)} / guest (once)`}
              />
              <Toggle
                checked={addons.membership}
                onChange={() => setAddon("membership")}
                title="Membership"
                hint="Extra −5% forever"
              />
            </div>

            <div className="mt-2 text-xs text-black/60">
              {addCount >= 3 ? "Mega bundle: −15% applied" : addCount >= 2 ? "Bundle: −10% applied" : "Bundle 2+ add-ons to save"}
              {addons.membership ? " + membership −5%" : ""}.
            </div>
          </div>
        </div>

        {/* summary */}
        <div className="rounded-xl border border-black/10 p-4 bg-[#F9FAFB] max-[420px]:p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/70">
              {rooms} room{rooms > 1 ? "s" : ""} × {nights} night{nights > 1 ? "s" : ""} @ {fmtUSD(baseNight)}
            </span>
            <span className="font-bold text-[#1E2352]">{fmtUSD(subtotal)}</span>
          </div>

          <div className="mt-2 space-y-1 text-sm">
            {addons.pickup && (
              <Row label="Airport pickup" val={fmtUSD(addPrices.pickup * rooms)} />
            )}
            {addons.breakfast && (
              <Row label="Breakfast" val={fmtUSD(addPrices.breakfast * guests * nights)} />
            )}
            {addons.spa && <Row label="Spa access" val={fmtUSD(addPrices.spa * guests)} />}
          </div>

          <div className="mt-2 border-t border-dashed border-black/15 pt-2 space-y-1 text-sm">
            {discount > 0 && <Row label="Discounts" val={`−${fmtUSD(discount)}`} strong />}
            <Row label="Taxes & fees" val={fmtUSD(taxes)} />
            <div className="flex items-center justify-between text-[18px] font-extrabold max-[420px]:text-[16px]">
              <span>Total</span>
              <span className="text-[#F59E0B]">{fmtUSD(total)}</span>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-black/60">* Selected hotels let you cancel for free up to 48h.</p>
        </div>
      </div>
    </section>
  );
}

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
    <div className="rounded-lg border border-black/10 p-3 max-[420px]:p-2.5">
      <div className="text-xs text-black/60">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="w-8 h-8 max-[480px]:w-7 max-[480px]:h-7 rounded-md border grid place-items-center hover:bg-black/5"
          onClick={() => setValue(Math.max(min, value - 1))}
        >
          −
        </button>
        <div className="w-12 text-center font-semibold">{value}</div>
        <button
          className="w-8 h-8 max-[480px]:w-7 max-[480px]:h-7 rounded-md border grid place-items-center hover:bg-black/5"
          onClick={() => setValue(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
function Toggle({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cls(
        "flex items-center justify-between gap-3 w-full rounded-lg border px-3 py-2",
        "max-[420px]:px-2.5 max-[420px]:py-2",
        checked ? "border-emerald-400 bg-emerald-50" : "border-black/10 hover:bg-black/5"
      )}
    >
      <span className="text-left">
        <span className="block text-sm font-medium text-[#1A1E43]">{title}</span>
        {hint && <span className="block text-[11px] text-black/60">{hint}</span>}
      </span>
      <span
        className={cls(
          "inline-flex h-5 w-9 items-center rounded-full p-[2px] transition",
          checked ? "bg-emerald-500" : "bg-black/20"
        )}
      >
        <span className={cls("h-4 w-4 rounded-full bg-white transition", checked ? "translate-x-4" : "")} />
      </span>
    </button>
  );
}
function Row({ label, val, strong = false }: { label: string; val: string; strong?: boolean }) {
  return (
    <div className={cls("flex items-center justify-between", strong && "font-semibold")}>
      <span className="text-black/70">{label}</span>
      <span>{val}</span>
    </div>
  );
}

/* ========== HOW IT WORKS ========== */
function HowItWorks() {
  const steps = [
    { t: "Search", d: "Use filters to find the perfect stay or activity." },
    { t: "Bundle", d: "Add flights and experiences to unlock extra discounts." },
    { t: "Book", d: "Pay securely and receive a beautiful itinerary." },
    { t: "Travel", d: "Get 24/7 support and real-time updates along the way." },
  ];
  const [i, setI] = useState(0);

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[420px]:p-3">
      <h2 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">How it works</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {steps.map((s, idx) => (
          <button
            key={s.t}
            onClick={() => setI(idx)}
            className={cls(
              "rounded-xl p-3 text-left border transition",
              "max-[420px]:p-2.5",
              i === idx ? "border-[#1E2352] ring-2 ring-[#1E2352]/20" : "border-black/10 hover:border-black/20"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cls("w-6 h-6 grid place-items-center rounded-full text-white text-sm", i === idx ? "bg-[#1E2352]" : "bg-black/30")}>
                {idx + 1}
              </span>
              <span className="font-semibold">{s.t}</span>
            </div>
            <p className="mt-1 text-sm text-black/70">{s.d}</p>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-[#F9FAFB] border border-dashed border-black/15 p-3 text-sm text-black/70">
        <b>{steps[i].t}</b>: {steps[i].d}
      </div>
    </section>
  );
}

/* ========== TESTIMONIALS (auto-carousel) ========== */
function Testimonials() {
  const items = [
    { name: "Amelia W.", text: "Booked a surprise weekend in Paris — the bundle discount paid for our croissants. Support solved a flight delay in minutes.", stars: 5 },
    { name: "Kenji R.", text: "Love the map filters. Found a hotel 2 mins from the subway and the itinerary looked gorgeous on my phone.", stars: 5 },
    { name: "Sofia L.", text: "The experiences were the highlight. Small group cooking class felt super local and authentic.", stars: 4 },
  ];
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => setIdx((p) => (p + 1) % items.length);
    timer.current = window.setInterval(tick, 4000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[420px]:p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">What travelers say</h2>
        <div className="space-x-2">
          <button
            className="h-9 w-9 rounded-md border hover:bg-black/5"
            onClick={() => setIdx((idx - 1 + items.length) % items.length)}
          >
            ‹
          </button>
          <button
            className="h-9 w-9 rounded-md border hover:bg-black/5"
            onClick={() => setIdx((idx + 1) % items.length)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-black/10 p-4 bg-[#F9FAFB] max-[420px]:p-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E2352] text-white grid place-items-center font-bold shrink-0">
            {items[idx].name.split(" ").map((x) => x[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#FEBB02]">
              {Array.from({ length: items[idx].stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4" />
              ))}
            </div>
            <p className="mt-1 text-sm text-black/80">{items[idx].text}</p>
            <div className="text-[12px] text-black/60 mt-1">— {items[idx].name}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FAQ (accordion) ========== */
function FAQ() {
  const data = [
    { q: "Can I cancel for free?", a: "Many stays and experiences allow free cancellation up to 48h. The rule is displayed before you confirm." },
    { q: "Do you charge hidden fees?", a: "No. Taxes and fees are shown in the price summary. We also price-match popular platforms." },
    { q: "Is my payment secure?", a: "We use PCI-compliant providers. Cards are tokenized and never stored on our servers." },
    { q: "Do you have group discounts?", a: "Yes, for 5+ rooms or 10+ travelers you get dedicated pricing and a concierge." },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[420px]:p-3">
      <h2 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">FAQ</h2>
      <div className="mt-3 divide-y divide-black/10">
        {data.map((x, i) => (
          <details
            key={x.q}
            open={open === i}
            onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open ? i : null)}
            className="group py-2"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 list-none">
              <span className="font-medium">{x.q}</span>
              <span className="w-6 h-6 grid place-items-center rounded-md border border-black/10">
                {open === i ? "−" : "+"}
              </span>
            </summary>
            <p className="mt-2 text-sm text-black/70">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ========== SIDE CTA ========== */
function SideCTA() {
  const perks = ["Member prices", "Free upgrades", "Priority support", "Invite-only events"];
  return (
    <aside className="lg:sticky lg:top-[120px] h-max rounded-2xl border border-black/10 bg-white p-4 sm:p-5 max-[1024px]:rounded-xl max-[420px]:p-3">
      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[12px]">
        <Spark className="w-4 h-4" /> New
      </div>
      <h3 className="mt-2 text-lg font-bold text-[#1A1E43] max-[1024px]:text-base">Membership</h3>
      <p className="text-sm text-black/70 max-[1024px]:text-[13px]">
        Unlock exclusive deals and concierge assistance for your trips.
      </p>
      <ul className="mt-3 space-y-1 text-sm text-black/80">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {p}
          </li>
        ))}
      </ul>
      <Link
        href="/hotels"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1E2352] text-white font-semibold hover:opacity-90 max-[420px]:h-9"
      >
        Explore hotels
      </Link>
      <p className="mt-2 text-[11px] text-black/60">
        You can cancel membership anytime. First month often free with bundles.
      </p>
    </aside>
  );
}

/* ========== HELP WIDGET (floating) ========== */
function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [log, setLog] = useState<string[]>([
    "Hey! Need help planning your next trip?",
  ]);

  const send = () => {
    if (!text.trim()) return;
    setLog((l) => [...l, `You: ${text.trim()}`, "Agent: Thanks! We'll get back within minutes."]);
    setText("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-[#1E2352] text-white grid place-items-center shadow-lg hover:opacity-90"
        aria-label="Help"
      >
        <Chat className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed right-4 bottom-20 z-50 w-[min(360px,92vw)] rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">
          <div className="p-3 bg-[#1A1E43] text-white flex items-center justify-between">
            <span className="font-semibold">Travel Help</span>
            <button className="opacity-80 hover:opacity-100" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="p-3 h-[240px] overflow-auto bg-[#F9FAFB] text-sm">
            {log.map((m, i) => (
              <div key={i} className="mb-2">
                {m}
              </div>
            ))}
          </div>
          <div className="p-3 flex gap-2 border-t border-black/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question…"
              className="flex-1 h-10 rounded-md border border-black/10 px-3 outline-none"
            />
            <button onClick={send} className="h-10 px-4 rounded-md bg-[#1E2352] text-white font-semibold">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
