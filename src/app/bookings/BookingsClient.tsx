"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getHotelById, fmtUSD } from "@/app/lib/hotels";

type Booking = {
  id: string;
  createdAt: string;
  status: "confirmed" | "cancelled";

  hotelId: string;
  hotelName: string;
  image: string;
  address: string;
  rating: number;
  stars: number;

  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;

  roomKey: string;
  roomType: string;

  pricePerNight: number;
  line: number;
  taxes: number;
  fees: number;
  total: number;
};

const dfmt = (s: string) =>
  new Date(s).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  // загрузка из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bookings_v1");
      const arr = raw ? (JSON.parse(raw) as Booking[]) : [];
      setBookings(arr);
    } catch {
      setBookings([]);
    }
  }, []);

  // синхронизация при работе в нескольких вкладках
  useEffect(() => {
    const h = () => {
      try {
        const raw = localStorage.getItem("bookings_v1");
        setBookings(raw ? JSON.parse(raw) : []);
      } catch {}
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((b) => {
      if (filter === "all") return true;
      if (filter === "upcoming") return b.checkIn >= today;
      return b.checkOut < today;
    });
  }, [bookings, filter]);

  const remove = (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const next = bookings.filter((b) => b.id !== id);
    setBookings(next);
    try {
      localStorage.setItem("bookings_v1", JSON.stringify(next));
    } catch {}
  };

  const clearAll = () => {
    if (!bookings.length) return;
    if (!confirm("Delete all saved bookings?")) return;
    setBookings([]);
    try {
      localStorage.removeItem("bookings_v1");
    } catch {}
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[6px] -mt-[120px] pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] sm:text-[24px] lg:text-[28px] font-bold text-white">
          Your Bookings
        </h1>

        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-white/20 bg-[#1A1E43] text-white px-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <button
            onClick={clearAll}
            className="h-9 px-3 rounded-md bg-white text-[#1A1E43] font-semibold"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filtered.map((b) => (
          <BookingCard key={b.id} b={b} onRemove={() => remove(b.id)} />
        ))}

        {!filtered.length && (
          <div className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-black/60">
            No bookings yet. Go to{" "}
            <Link href="/hotels" className="text-[#1E2352] underline">
              Hotels
            </Link>{" "}
            and book a room.
          </div>
        )}
      </div>
    </section>
  );
}

function BookingCard({ b, onRemove }: { b: Booking; onRemove: () => void }) {
  const hotel = getHotelById(b.hotelId);
  return (
    <article className="rounded-xl border border-black/10 bg-white p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
        {/* left image */}
        <div className="relative w-full lg:w-[220px] h-[140px] rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={b.image}
            alt={b.hotelName}
            fill
            className="object-cover"
          />
        </div>

        {/* center info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/hotel/${b.hotelId}?checkIn=${b.checkIn}&checkOut=${b.checkOut}`}
                className="text-[16px] sm:text-[18px] font-semibold text-[#1A1E43] hover:text-[#FEBB02]"
              >
                {b.hotelName}
              </Link>
              <div className="text-xs sm:text-sm text-black/70 truncate">
                {b.address}
              </div>
              <div className="mt-1 text-[11px] text-black/60 flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-600 text-white">
                  {b.rating?.toFixed?.(1) ?? hotel?.rating?.toFixed?.(1)}
                </span>
                <span>{b.stars}★</span>
              </div>
            </div>

            {/* top-right meta */}
            <div className="text-right shrink-0">
              <div className="text-[11px] text-black/60">
                {b.rooms} room{b.rooms > 1 ? "s" : ""} × {b.nights} night
                {b.nights > 1 ? "s" : ""}
              </div>
              <div className="text-[18px] font-bold text-[#F59E0B]">
                {fmtUSD(b.total)}
              </div>
            </div>
          </div>

          {/* dates */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-black/60">Check-in</div>
              <div className="font-medium">{dfmt(b.checkIn)}</div>
            </div>
            <div>
              <div className="text-xs text-black/60">Check-out</div>
              <div className="font-medium">{dfmt(b.checkOut)}</div>
            </div>
          </div>

          {/* footer actions */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Link
              href={`/hotel/${b.hotelId}?checkIn=${b.checkIn}&checkOut=${b.checkOut}&rooms=${b.rooms}&adults=${b.adults}&children=${b.children}`}
              className="inline-flex h-9 px-4 items-center justify-center rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90"
            >
              View details
            </Link>

            <button
              onClick={onRemove}
              className="inline-flex h-9 px-4 items-center justify-center rounded-md border border-black/15 text-[#1A1E43] hover:bg-black/5"
            >
              Cancel booking
            </button>

            <span className="ml-auto text-[11px] text-black/60">
              booked {dfmt(b.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
