"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

/** соответствие заголовков id отелей */
const HEADING_TO_ID: Record<string, string> = {
  "Luxury Seaside Villa": "dubai-ocean",
  "Alpine Mountain Lodge": "paris-raphael",
  "Urban Boutique Hotel": "tokyo-urban",
  "Rainforest Eco Resort": "ist-old",
};

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export default function Category() {
  const data = [
    {
      image: "/Category/Hotel-Best-Auto-Hogar.svg",
      heading: "Luxury Seaside Villa",
      cost: "4200",
      period: "Day and Night",
      address: "Ocean Drive, Malibu, USA",
      beds: "6 King Beds",
      sleeps: "12 Guests",
      size: "4,500 Sq Ft",
    },
    {
      image: "/Category/Hotel-Raphael.svg",
      heading: "Alpine Mountain Lodge",
      cost: "1850",
      period: "Day and Night",
      address: "Matterhorn Valley, Zermatt, Switzerland",
      beds: "4 Queen Beds",
      sleeps: "8 Guests",
      size: "2,200 Sq Ft",
    },
    {
      image: "/Category/Kayakapi-Premium.svg",
      heading: "Urban Boutique Hotel",
      cost: "980",
      period: "Night",
      address: "5th Avenue, Manhattan, New York",
      beds: "2 Deluxe Beds",
      sleeps: "4 Guests",
      size: "1,050 Sq Ft",
    },
    {
      image: "/Category/Trump-International.svg",
      heading: "Rainforest Eco Resort",
      cost: "1350",
      period: "Day and Night",
      address: "Amazon River, Manaus, Brazil",
      beds: "3 Eco Beds",
      sleeps: "6 Guests",
      size: "1,800 Sq Ft",
    },
  ];

  return (
    <section className="w-full flex flex-col mt-[56px] sm:mt-[64px] lg:mt-[78px] px-4 sm:px-6 lg:px-[150px] gap-y-[24px] lg:gap-y-[32px]">
      <h2 className="text-[#23274A] leading-[30px] lg:leading-[34px] text-[22px] sm:text-[24px] lg:text-[28px] font-bold flex flex-col items-start">
        Category
        <span className="mt-[14px] lg:mt-[20px] w-[110px] sm:w-[130px] lg:w-[150px] h-[3px] bg-[#FEBB02] rounded" />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] sm:gap-[24px] lg:gap-[32px]">
        {data.map((item, i) => (
          <Card key={i} ItmeMenu={item} />
        ))}
      </div>
    </section>
  );
}

function Card({ ItmeMenu }: any) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const toggle = () => setOpen((v) => !v);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const hotelId = HEADING_TO_ID[ItmeMenu.heading];
  const detailsHref = hotelId ? `/hotel/${hotelId}` : "/hotels";
  const basePrice = Number(ItmeMenu.cost) || 1000;

  return (
    <article className="w-full h-auto gap-y-4 lg:gap-y-5 flex flex-col items-start">
      <div
        role="button"
        aria-label="Show details"
        aria-expanded={open}
        aria-controls={panelId}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={onKey}
        className="
          relative group w-full cursor-pointer md:cursor-default select-none
          aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]
          bg-cover bg-center rounded-[12px] overflow-hidden
        "
        style={{ backgroundImage: `url(${ItmeMenu.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        <div
          id={panelId}
          className={[
            "absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300",
            open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3",
            "md:opacity-0 md:translate-x-3 md:group-hover:opacity-100 md:group-hover:translate-x-0",
          ].join(" ")}
        >
          <div className="w-[68px] sm:w-[72px] lg:w-[75px] px-3 py-3 sm:py-4 bg-white/85 backdrop-blur-md rounded-l-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] flex flex-col items-center gap-4 sm:gap-5">
            <TooltipIcon icon="/Icons/bed.svg" text={ItmeMenu.beds} />
            <TooltipIcon icon="/Icons/person.svg" text={ItmeMenu.sleeps} />
            <TooltipIcon icon="/Icons/size.svg" text={ItmeMenu.size} />
          </div>
        </div>
      </div>

      <div className="w-full h-auto gap-y-1.5 lg:gap-y-2.5 flex flex-col items-start">
        {/* заголовок — Link */}
        <Link
          href={detailsHref}
          className="text-[#23284C] leading-[22px] lg:leading-[24px] text-[16px] sm:text-[17px] lg:text-[18px] font-bold hover:text-[#FEBB02] transition"
        >
          {ItmeMenu.heading}
        </Link>

        <div className="flex items-baseline gap-x-1 text-[#FEBB02]">
          <span className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold leading-none">
            {fmtUSD(basePrice)}
          </span>
          <span className="text-[12px] sm:text-[13px] lg:text-[14px] font-medium leading-none opacity-90">
            / {ItmeMenu.period}
          </span>
        </div>

        <p className="text-[#23284C]/80 leading-[16px] lg:leading-[17px] text-[13px] sm:text-[14px] font-medium">
          {ItmeMenu.address}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={detailsHref}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#1E2352] text-white text-sm font-semibold hover:opacity-90"
          >
            View details
          </Link>

          <SelectRooms
            hotelId={hotelId}
            hotelName={ItmeMenu.heading}
            basePrice={basePrice}
            detailsHref={detailsHref}
          />
        </div>
      </div>
    </article>
  );
}

/* реюз модалки из toprated — скопирована сюда, чтобы файл был самодостаточным */
function SelectRooms({
  hotelId,
  hotelName,
  basePrice,
  detailsHref,
}: {
  hotelId?: string;
  hotelName: string;
  basePrice: number;
  detailsHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [roomIdx, setRoomIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [nights, setNights] = useState(1);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [shortlist, setShortlist] = useLocalStorage<any[]>("shortlist", []);

  const rooms = [
    { name: "Standard", beds: "1 Queen", perks: ["Free Wi-Fi", "City view"], mult: 1.0 },
    { name: "Deluxe", beds: "1 King", perks: ["Breakfast included", "Late checkout"], mult: 1.25, badge: "Popular" },
    { name: "Suite", beds: "2 Rooms", perks: ["Lounge access", "Spa credit"], mult: 1.6, badge: "Best value" },
  ];
  const pricePerNight = Math.round(basePrice * rooms[roomIdx].mult);
  const total = pricePerNight * qty * nights;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const addToShortlist = () => {
    const entry = {
      hotelId: hotelId ?? "unknown",
      hotelName,
      roomType: rooms[roomIdx].name,
      qty,
      nights,
      pricePerNight,
      total,
      ts: Date.now(),
    };
    setShortlist([...shortlist, entry]);
    setSavedMsg("Added to shortlist ✓");
    setTimeout(() => setSavedMsg(null), 1500);
  };

  const goHref = `${detailsHref}?rooms=${qty}&nights=${nights}&room=${encodeURIComponent(
    rooms[roomIdx].name,
  )}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#1E2352] text-[#1E2352] text-sm font-semibold hover:bg-[#1E2352]/5"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Select rooms
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="ml-auto relative h-full w-[min(100vw,420px)] bg-white shadow-2xl p-4 sm:p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1E43]">{hotelName}</h3>
                <p className="text-xs text-black/60">Choose room, rooms count & nights</p>
              </div>
              <button className="rounded-md border px-3 py-1.5 text-sm" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {rooms.map((r, i) => {
                const active = i === roomIdx;
                const ppn = Math.round(basePrice * r.mult);
                return (
                  <label
                    key={r.name}
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
                          checked={active}
                          onChange={() => setRoomIdx(i)}
                          className="accent-[#1E2352]"
                        />
                        <span className="font-semibold text-[#23284C]">{r.name}</span>
                        {r.badge && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                            {r.badge}
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-[#FEBB02] font-bold">{fmtUSD(ppn)}/night</span>
                    </div>
                    <div className="mt-1 text-xs text-black/70">
                      {r.beds} • {r.perks.join(" • ")}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Counter label="Rooms" value={qty} setValue={setQty} />
              <Counter label="Nights" value={nights} setValue={setNights} />
            </div>

            <div className="mt-4 rounded-lg border border-black/10 p-3 bg-[#F9FAFB]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70">
                  {qty} room{qty > 1 ? "s" : ""} × {nights} night{nights > 1 ? "s" : ""} • {rooms[roomIdx].name}
                </span>
                <span className="font-bold text-[#1E2352]">{fmtUSD(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-black/60">Free cancellation • No prepayment needed</p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button className="h-10 rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90" onClick={addToShortlist}>
                Save to shortlist
              </button>
              <Link
                href={goHref}
                className="h-10 rounded-md border border-[#1E2352] text-[#1E2352] font-semibold grid place-items-center hover:bg-[#1E2352]/5"
                onClick={() => setOpen(false)}
              >
                Continue to details
              </Link>
              {savedMsg && <div className="text-center text-sm text-emerald-700">{savedMsg}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Counter({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div className="rounded-md border border-black/15 p-3">
      <div className="text-xs text-black/60">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-md border grid place-items-center hover:bg-black/5"
          onClick={() => setValue(Math.max(1, value - 1))}
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

function TooltipIcon({ icon, text }: { icon: string; text: string }) {
  const [show, setShow] = useState(false);
  const toggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setShow((v) => !v);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  };
  return (
    <div
      className="relative group/icon"
      role="button"
      tabIndex={0}
      aria-label={text}
      aria-pressed={show}
      onClick={toggle}
      onKeyDown={onKey}
    >
      <img
        src={icon}
        alt=""
        className="w-[22px] sm:w-[24px] lg:w-[26px] h-[22px] sm:h-[24px] lg:h-[26px] transition-transform duration-200 group-hover/icon:scale-110"
      />
      <div
        className={[
          "absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1.5 rounded-md bg-[#23284C] text-white",
          "text-[11px] sm:text-[12px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          "transition-all duration-200",
          show ? "opacity-100 scale-100" : "opacity-0 scale-95",
          "md:opacity-0 md:scale-95 md:group-hover/icon:opacity-100 md:group-hover/icon:scale-100",
        ].join(" ")}
      >
        {text}
        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-[#23284C]" />
      </div>
    </div>
  );
}
