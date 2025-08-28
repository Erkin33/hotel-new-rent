"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getHotelById, ROOM_TYPES, fmtUSD } from "@/app/lib/hotels";

const parseIntSafe = (v: string | null, def = 0) =>
  (v ? Math.max(def, parseInt(v, 10) || def) : def);

const nightsBetween = (a: string, b: string) =>
  Math.max(1, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / (24 * 3600 * 1000)));

export default function BookingClient() {
  const router = useRouter();
  const sp = useSearchParams();

  // --- пробуем URL -> draft из localStorage
  const draft = useMemo(() => {
    try {
      const raw = localStorage.getItem("bookingDraft");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const hotelId = sp.get("hotelId") || draft?.hotelId;
  const hotel = getHotelById(hotelId || "");

  const checkIn = sp.get("checkIn") || draft?.checkIn || new Date().toISOString().slice(0, 10);
  const checkOut =
    sp.get("checkOut") ||
    draft?.checkOut ||
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    })();

  const rooms = parseIntSafe(sp.get("rooms"), draft?.rooms || 1);
  const adults = parseIntSafe(sp.get("adults"), draft?.adults || 2) || 1;
  const children = parseIntSafe(sp.get("children"), draft?.children || 0);

  const roomKey = sp.get("room") || draft?.roomKey || "deluxe";
  const roomType = ROOM_TYPES.find((r) => r.key === roomKey) || ROOM_TYPES[1];

  const nights = nightsBetween(checkIn, checkOut);
  const pricePerNight = hotel ? Math.round(hotel.price * roomType.mult) : 0;
  const line = pricePerNight * rooms * nights;
  const taxes = Math.round(line * 0.12);
  const fees = 18;
  const total = line + taxes + fees;

  // форма
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    note: "",
    cardName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    billFirst: "",
    billLast: "",
    billPhone: "",
    billEmail: "",
    billCountry: "",
    billState: "",
    billZip: "",
  });

  // поддерживаем актуальность черновика
  useEffect(() => {
    if (!hotel) return;
    const d = {
      hotelId,
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
      roomKey: roomType.key,
      pricePerNight,
      line,
      taxes,
      fees,
      total,
    };
    try {
      localStorage.setItem("bookingDraft", JSON.stringify(d));
    } catch {}
  }, [
    hotelId,
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
    roomType.key,
    pricePerNight,
    line,
    taxes,
    fees,
    total,
    hotel,
  ]);

  if (!hotel) {
    return (
      <div className="px-6 lg:px-[150px] pt-[110px]">
        <h1 className="text-2xl font-bold">Nothing to book</h1>
        <p className="mt-2">
          Open a hotel page and click <b>Book availability</b>.
        </p>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- формируем сохранённую бронь
    const saved = {
      id:
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString(),
      status: "confirmed" as const,

      hotelId,
      hotelName: hotel.name,
      image: hotel.image,
      address: hotel.address,
      rating: hotel.rating,
      stars: hotel.stars,

      checkIn,
      checkOut,
      nights,
      rooms,
      adults,
      children,

      roomKey: roomType.key,
      roomType: roomType.name,

      pricePerNight,
      line,
      taxes,
      fees,
      total,
    };

    try {
      const raw = localStorage.getItem("bookings_v1");
      const arr = raw ? (JSON.parse(raw) as typeof saved[]) : [];
      arr.unshift(saved); // сверху
      localStorage.setItem("bookings_v1", JSON.stringify(arr));
      localStorage.removeItem("bookingDraft");
    } catch {}

    router.push("/bookings");
  };

  return (
    <main className="px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[6px] pt-[96px] sm:pt-[112px] lg:pt-[126px] pb-16">
      <h1 className="text-xl font-semibold text-[#1A1E43] mb-3">Confirm Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* LEFT — form */}
        <form onSubmit={submit} className="lg:col-span-2 grid gap-4">
          {/* Your details */}
          <section className="rounded-xl border border-black/10 bg-white p-4">
            <h3 className="font-semibold text-[#1A1E43]">Your details</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="First name *" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Input label="Last name *" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
              <Input label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Input label="Email Address *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Input label="Salutation" value={form.note} onChange={(v) => setForm({ ...form, note: v })} className="sm:col-span-2" />
              <Textarea
                label="Special requests to hotel"
                value={form.note}
                onChange={(v) => setForm({ ...form, note: v })}
                className="sm:col-span-2"
              />
            </div>
          </section>

          {/* Payment Information */}
          <section className="rounded-xl border border-black/10 bg-white p-4">
            <h3 className="font-semibold text-[#1A1E43]">Payment Information</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name on card *" value={form.cardName} onChange={(v) => setForm({ ...form, cardName: v })} />
              <Input label="Credit Card Number *" value={form.cardNumber} onChange={(v) => setForm({ ...form, cardNumber: v })} />
              <Select label="Expiration (MM) *" value={form.expMonth} onChange={(v) => setForm({ ...form, expMonth: v })} options={[
                "", "01","02","03","04","05","06","07","08","09","10","11","12"
              ]} />
              <Select label="Year *" value={form.expYear} onChange={(v) => setForm({ ...form, expYear: v })} options={[
                "", "2025","2026","2027","2028","2029","2030","2031","2032","2033","2034"
              ]} />
              <Input label="CVC/CVV *" value={form.cvc} onChange={(v) => setForm({ ...form, cvc: v })} />
            </div>
          </section>

          {/* Billing Address */}
          <section className="rounded-xl border border-black/10 bg-white p-4">
            <h3 className="font-semibold text-[#1A1E43]">Billing Address</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="First name" value={form.billFirst} onChange={(v) => setForm({ ...form, billFirst: v })} />
              <Input label="Last name" value={form.billLast} onChange={(v) => setForm({ ...form, billLast: v })} />
              <Input label="Phone Number" value={form.billPhone} onChange={(v) => setForm({ ...form, billPhone: v })} />
              <Input label="Email Address" value={form.billEmail} onChange={(v) => setForm({ ...form, billEmail: v })} />
              <Input label="Country" value={form.billCountry} onChange={(v) => setForm({ ...form, billCountry: v })} />
              <Input label="State/Province" value={form.billState} onChange={(v) => setForm({ ...form, billState: v })} />
              <Input label="Postal/ZIP Code" value={form.billZip} onChange={(v) => setForm({ ...form, billZip: v })} />
            </div>
          </section>

          <div className="pt-2">
            <button className="w-full h-11 rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90">
              Confirm & Proceed
            </button>
          </div>
        </form>

        {/* RIGHT — summary */}
        <aside className="grid gap-3">
          {/* Hotel card */}
          <section className="rounded-xl border border-black/10 bg-white p-3">
            <div className="flex gap-3">
              <div className="relative w-[84px] h-[84px] rounded-md overflow-hidden shrink-0">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1A1E43] truncate">{hotel.name}</div>
                <div className="text-xs text-black/70 truncate">{hotel.address}</div>
                <div className="mt-1 text-[11px] text-black/60 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-600 text-white">{hotel.rating.toFixed(1)}</span>
                  <span>{hotel.stars}★</span>
                  <span>{hotel.reviews} reviews</span>
                </div>
              </div>
            </div>
          </section>

          {/* Booking details */}
          <section className="rounded-xl border border-black/10 bg-white p-3 text-sm">
            <div className="font-semibold text-[#1A1E43] mb-2">Your booking details</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-black/60">Check-in</div>
                <div className="font-medium">{checkIn}</div>
              </div>
              <div>
                <div className="text-xs text-black/60">Check-out</div>
                <div className="font-medium">{checkOut}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-black/60">
              {nights} night{nights > 1 ? "s" : ""}, {rooms} room{rooms > 1 ? "s" : ""}, {adults} adult
              {adults > 1 ? "s" : ""}{children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""} • {roomType.name}
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border border-black/10 bg-white p-3 text-sm">
            <div className="font-semibold text-[#1A1E43] mb-2">Pricing Summary</div>
            <div className="flex justify-between">
              <span>
                {rooms} × {roomType.name} × {nights} night{nights > 1 ? "s" : ""} @ {fmtUSD(pricePerNight)}
              </span>
              <span>{fmtUSD(line)}</span>
            </div>
            <div className="flex justify-between text-xs text-black/60 mt-1">
              <span>Tax and service fees</span>
              <span>{fmtUSD(taxes + fees)}</span>
            </div>
            <div className="mt-2 border-t border-dashed border-black/10 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{fmtUSD(total)}</span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

/* ------- UI helpers ------- */
function Input({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`text-sm font-medium text-[#222243] ${className}`}>
      {label}
      <input
        className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`text-sm font-medium text-[#222243] ${className}`}>
      {label}
      <textarea
        className="mt-1 min-h-[120px] w-full rounded-md border border-black/10 p-3 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <label className={`text-sm font-medium text-[#222243] ${className}`}>
      {label}
      <select
        className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "Select"}
          </option>
        ))}
      </select>
    </label>
  );
}
