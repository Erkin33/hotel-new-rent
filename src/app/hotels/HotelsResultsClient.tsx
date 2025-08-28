"use client";

import Link from "next/link";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { HOTELS as BASE } from "@/app/lib/hotels";

/* =================== TYPES & CONST =================== */
type Hotel = (typeof BASE)[number];

const ALL = "All Hotels";
const COUNTRIES = [ALL, ...Array.from(new Set(BASE.map((h) => h.country)))];

const PRICE_BUCKETS = [
  { key: "0-200", min: 0, max: 200, label: "$ 0 - $ 200" },
  { key: "200-500", min: 200, max: 500, label: "$ 200 - $ 500" },
  { key: "500-1000", min: 500, max: 1000, label: "$ 500 - $ 1,000" },
  { key: "1000-2000", min: 1000, max: 2000, label: "$ 1,000 - $ 2,000" },
  { key: "2000-5000", min: 2000, max: 5000, label: "$ 2,000 - $ 5,000" },
] as const;

/* =================== HELPERS =================== */
function lev(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  return dp[m][n];
}
function normalizeCountry(input?: string) {
  if (!input) return COUNTRIES[0];
  const lc = input.trim().toLowerCase();
  const alias: Record<string, string> = {
    all: ALL, "all-hotels": ALL, dubay: "Dubai", дубай: "Dubai",
    singapure: "Singapore", сингапур: "Singapore",
    tokio: "Tokyo", tonkyo: "Tokyo", токио: "Tokyo",
    "new-york": "New York", ny: "New York", стамбул: "Istanbul",
  };
  if (alias[lc]) return alias[lc];
  const best = COUNTRIES.map((c) => ({ c, d: lev(lc, c.toLowerCase()) })).sort((a, b) => a.d - b.d)[0];
  return best && best.d <= 2 ? best.c : COUNTRIES[0];
}
function nightsBetween(a?: string, b?: string) {
  try {
    if (!a || !b) return 1;
    const d1 = new Date(a), d2 = new Date(b);
    return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (24 * 3600 * 1000)));
  } catch {
    return 1;
  }
}
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-[2px] text-[#FEBB02] text-sm">
      {Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < count ? "★" : "☆"}</span>)}
    </div>
  );
}

/* mini-icons */
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0 text-[#1E2352]" fill="currentColor">
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
  </svg>
);
const WifiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#229935]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" />
  </svg>
);
const PoolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#229935]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 22c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0" />
    <path d="M6 16c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0" />
    <path d="M6 10c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0" />
  </svg>
);
const SpaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#229935]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 22s5-7 7-7 7 7 7 7" /><path d="M12 15V3" /><path d="M8 7h8" />
  </svg>
);
const BreadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#229935]" fill="currentColor">
    <path d="M2 9a5 5 0 0 1 5-5h10a5 5 0 0 1 0 10v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9Z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-black/60" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* =================== COMPONENT =================== */
export default function HotelsResultsClient({
  initialParams,
}: {
  initialParams: {
    country?: string;
    checkIn?: string;
    checkOut?: string;
    rooms?: string;
    adults?: string;
    children?: string;
  };
}) {
  const router = useRouter();

  const [country, setCountry] = useState(normalizeCountry(initialParams.country));
  const [checkIn, setCheckIn] = useState(initialParams.checkIn ?? new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(
    initialParams.checkOut ??
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
      })(),
  );
  const [rooms, setRooms] = useState(Number(initialParams.rooms ?? 1));
  const [adults, setAdults] = useState(Number(initialParams.adults ?? 2));
  const [children, setChildren] = useState(Number(initialParams.children ?? 0));

  // filters
  const [query, setQuery] = useState("");
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // for <1024px

  const nights = nightsBetween(checkIn, checkOut);

  const hotelsInCountry = useMemo(() => {
    if (country === ALL) return BASE;
    return BASE.filter((h) => h.country.toLowerCase() === country.toLowerCase());
  }, [country]);

  const bucketCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of PRICE_BUCKETS) map[b.key] = 0;
    hotelsInCountry.forEach((h) => {
      for (const b of PRICE_BUCKETS) if (h.price >= b.min && h.price < b.max) map[b.key]++;
    });
    return map;
  }, [hotelsInCountry]);

  const starsCounts = useMemo(() => {
    const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    hotelsInCountry.forEach((h) => {
      map[h.stars] = (map[h.stars] ?? 0) + 1;
    });
    return map;
  }, [hotelsInCountry]);

  const results = useMemo(() => {
    return hotelsInCountry
      .filter((h) => (query ? h.name.toLowerCase().includes(query.toLowerCase()) : true))
      .filter((h) =>
        selectedBuckets.length
          ? selectedBuckets.some((k) => {
              const b = PRICE_BUCKETS.find((x) => x.key === k)!;
              return h.price >= b.min && h.price < b.max;
            })
          : true,
      )
      .filter((h) => (selectedStars ? h.stars === selectedStars : true));
  }, [hotelsInCountry, query, selectedBuckets, selectedStars]);

  const resubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      country,
      checkIn,
      checkOut,
      rooms: String(rooms),
      adults: String(adults),
      children: String(children),
    });
    router.replace(`/hotels?${params.toString()}`);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[5px]">
      {/* WHITE SEARCH PANEL (not sticky) */}
      <div className="mx-auto w-full max-w-6xl -mt-16 sm:-mt-14 lg:-mt-12 z-20">
        <div className="bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] rounded-xl ring-1 ring-black/5 p-3 sm:p-4">
          <form onSubmit={resubmit} className="flex flex-wrap items-end gap-2 sm:gap-3">
            <label className="flex-1 min-w-[180px] text-sm font-medium text-[#222243]">
              Destination
              <select
                value={country}
                onChange={(e) => setCountry(normalizeCountry(e.target.value))}
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="w-[160px] max-[1024px]:w-[48%] text-sm font-medium text-[#222243]">
              Check-in
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
              />
            </label>
            <label className="w-[160px] max-[1024px]:w-[48%] text-sm font-medium text-[#222243]">
              Check-out
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
              />
            </label>
            <label className="w-[110px] max-[1024px]:w-[32%] text-sm font-medium text-[#222243]">
              Rooms
              <input
                type="number"
                min={1}
                value={rooms}
                onChange={(e) => setRooms(Math.max(1, Number(e.target.value || 1)))}
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
              />
            </label>
            <label className="w-[130px] max-[1024px]:w-[32%] text-sm font-medium text-[#222243]">
              Guests
              <input
                type="number"
                min={1}
                value={adults + children}
                onChange={(e) => {
                  const t = Math.max(1, Number(e.target.value || 1));
                  // collapse into adults for simple UI
                  setAdults(t);
                  setChildren(0);
                }}
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-2 outline-none"
              />
            </label>
            <div className="ms-auto max-[1024px]:w-full max-[1024px]:mt-2">
              <button className="h-10 px-5 w-full max-[1024px]:w-full rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90">
                Search Again
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* mobile filter button */}
      <div className="mt-4 lg:hidden flex justify-end">
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-black/15 bg-white shadow-sm"
        >
          <SearchIcon />
          Filters
        </button>
      </div>

      {/* TWO COLUMNS: filters + results */}
      <div className="mt-6 flex gap-5 max-[1024px]:gap-4">
        {/* left column (sticky on >=1024px) */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-5 lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-8rem)] lg:overflow-auto pr-1">
          <FilterContent
            query={query}
            setQuery={setQuery}
            selectedBuckets={selectedBuckets}
            setSelectedBuckets={setSelectedBuckets}
            selectedStars={selectedStars}
            setSelectedStars={setSelectedStars}
            bucketCounts={bucketCounts}
            starsCounts={starsCounts}
          />
        </aside>

        {/* results */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-[#23274A] text-[18px] sm:text-[20px] font-bold">
            {country}: {results.length} results found
          </h1>

          {results.map((h) => {
            const total = h.price * nights * rooms;

            return (
              <article
                key={h.id}
                className="rounded-xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 max-[1024px]:gap-3">
                  {/* LEFT image block (285x200 on md+) */}
                  <div className="w-full md:w-[285px] md:shrink-0">
                    <Link href={`/hotel/${h.id}`} className="block">
                      <div
                        className="w-full h-[200px] rounded-lg bg-center bg-cover"
                        style={{ backgroundImage: `url(${h.image})` }}
                        aria-label={h.name}
                      />
                    </Link>
                  </div>

                  {/* RIGHT info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            className="truncate text-[#23284C] text-[16px] sm:text-[18px] font-bold hover:text-[#FEBB02] max-w-[220px] sm:max-w-none"
                            href={`/hotel/${h.id}`}
                            title={h.name}
                          >
                            {h.name}
                          </Link>
                          <span className="inline-flex items-center rounded-md bg-green-600 text-white text-xs px-1.5 py-0.5">
                            {h.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm flex-wrap">
                          <Stars count={h.stars} />
                          <span className="text-black/70">5.0 ({h.reviews} Reviews)</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        {h.amenities.includes("wifi") && <WifiIcon />}
                        {h.amenities.includes("pool") && <PoolIcon />}
                        {h.amenities.includes("spa") && <SpaIcon />}
                        {h.amenities.includes("breakfast") && <BreadIcon />}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-black/75 line-clamp-2">
                      With a stay at {h.name}, you&apos;ll be centrally located in{" "}
                      {h.address.split(",").pop()?.trim() ?? h.country}. This {h.stars}-star hotel offers excellent
                      comfort and amenities.
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-black/75">
                      <PinIcon />
                      <span className="truncate">{h.address}</span>
                    </div>

                    <div className="mt-3 flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-3">
                      <Link
                        href={`/hotel/${h.id}`}
                        className="h-9 px-5 rounded-md items-center flex bg-[#1E2352] text-white text-[14px] font-semibold hover:opacity-90 w-full sm:w-auto text-center"
                      >
                        Select rooms
                      </Link>

                      <div className="text-right sm:text-right">
                        <div className="text-sm text-black/60">
                          {rooms} room {nights} night{nights > 1 ? "s" : ""}
                        </div>
                        <div className="text-[#F59E0B] text-[20px] font-bold">${total.toLocaleString()}</div>
                        <div className="text-[11px] text-black/60">Taxes incl.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {!results.length && (
            <div className="rounded-md border border-dashed border-black/15 p-6 text-center text-black/60">
              No hotels match your filters.
            </div>
          )}
        </div>
      </div>

      {/* Slide-in filters for mobile */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[70]">
          <button aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute right-0 top-0 h-full w-[min(100vw,380px)] bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#1A1E43]">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-md border px-3 py-1.5 text-sm">
                Close
              </button>
            </div>
            <FilterContent
              query={query}
              setQuery={setQuery}
              selectedBuckets={selectedBuckets}
              setSelectedBuckets={setSelectedBuckets}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              bucketCounts={bucketCounts}
              starsCounts={starsCounts}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* =================== FILTERS =================== */
function FilterContent({
  query,
  setQuery,
  selectedBuckets,
  setSelectedBuckets,
  selectedStars,
  setSelectedStars,
  bucketCounts,
  starsCounts,
}: {
  query: string;
  setQuery: (v: string) => void;
  selectedBuckets: string[];
  setSelectedBuckets: Dispatch<SetStateAction<string[]>>;
  selectedStars: number | null;
  setSelectedStars: Dispatch<SetStateAction<number | null>>;
  bucketCounts: Record<string, number>;
  starsCounts: Record<number, number>;
}) {
  return (
    <>
      {/* Search by hotel name */}
      <div className="rounded-md overflow-hidden ring-1 ring-black/10 bg-white">
        <div className="bg-[#1A1E43] text-white px-4 py-3 text-sm font-semibold">Search by hotel name</div>
        <div className="p-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              className="w-full h-9 rounded-md border border-black/15 pl-9 pr-3 outline-none text-sm"
              placeholder="eg. The Fullerton Hotel"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[12px] font-semibold text-[#23284C]/70">Filter results</p>

      {/* Price Range */}
      <div className="rounded-md overflow-hidden ring-1 ring-black/10 bg-white">
        <div className="bg-[#1A1E43] text-white px-4 py-3 text-sm font-semibold">Price Range</div>
        <div className="p-3 space-y-2 text-[13px]">
          {PRICE_BUCKETS.map((b) => {
            const checked = selectedBuckets.includes(b.key);
            return (
              <label key={b.key} className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[#1E2352]"
                    checked={checked}
                    onChange={(e) =>
                      setSelectedBuckets((prev) => (e.target.checked ? [...prev, b.key] : prev.filter((k) => k !== b.key)))
                    }
                  />
                  <span>{b.label}</span>
                </span>
                <span className="text-black/50">{bucketCounts[b.key] ?? 0}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Star Rating */}
      <div className="rounded-md overflow-hidden ring-1 ring-black/10 bg-white">
        <div className="bg-[#1A1E43] text-white px-4 py-3 text-sm font-semibold">Star Rating</div>
        <div className="p-3 space-y-2 text-[13px]">
          {[5, 4, 3, 2, 1].map((s) => (
            <label key={s} className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="stars"
                  className="accent-[#1E2352]"
                  checked={selectedStars === s}
                  onChange={() => setSelectedStars((prev) => (prev === s ? null : s))}
                />
                <Stars count={s} />
              </span>
              <span className="text-black/50">{starsCounts[s as 1 | 2 | 3 | 4 | 5] ?? 0}</span>
            </label>
          ))}
          <button type="button" onClick={() => setSelectedStars(null)} className="text-xs text-[#1E2352] underline">
            Clear rating
          </button>
        </div>
      </div>
    </>
  );
}
