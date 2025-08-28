"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function MainBanner() {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[520px] mt-[84px] sm:mt-[92px] lg:mt-[100px] bg-[url(/MainPage/Hotel.svg)] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-0" />
        <div className="absolute inset-x-0 top-[18%] sm:top-[20%] lg:top-[22%] z-10 px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] ">
          <div className="max-w-[720px] space-y-3 text-left">
            <h1 className="text-white font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]
                           text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px]">
              Chase elegance. Reserve your
              <br className="hidden sm:block" />
              dream stay now.
            </h1>
            <p className="text-white/90 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]
                          text-sm sm:text-base md:text-xl lg:text-2xl max-w-[620px]">
              Discover the finest hotels from all over the world.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-4 sm:px-6">
        <div className="w-[min(1024px,92%)] mx-auto lg:-mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  const router = useRouter();
  const cities = ["Singapore", "Paris", "New York", "Tokyo", "Dubai", "Istanbul"];

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const tomorrowISO = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10);
  }, []);

  const [city, setCity] = useState(cities[0]);
  const [checkIn, setCheckIn] = useState(todayISO);
  const [checkOut, setCheckOut] = useState(tomorrowISO);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const onChangeCheckIn = (v: string) => {
    setCheckIn(v);
    if (checkOut < v) {
      const d = new Date(v);
      d.setDate(d.getDate() + 1);
      setCheckOut(d.toISOString().slice(0, 10));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      country: city, checkIn, checkOut,
      rooms: String(rooms), adults: String(adults), children: String(children),
    });
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white/95 backdrop-blur rounded-xl shadow-lg ring-1 ring-black/5
                 overflow-hidden p-2 sm:p-3 grid grid-cols-2 gap-2 sm:gap-3
                 max-[420px]:grid-cols-1
                 lg:flex lg:items-stretch lg:justify-between lg:gap-0 lg:p-0 lg:divide-x lg:divide-black/10"
    >
      <Field title="Where are you headed?" className="col-span-2 sm:col-span-1">
        <select value={city} onChange={(e)=>setCity(e.target.value)} className="h-10 w-full lg:w-44 bg-transparent outline-none text-[#17183B] font-medium leading-none pr-6">
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field title="Check in" className="col-span-1">
        <input type="date" value={checkIn} min={todayISO} onChange={(e)=>onChangeCheckIn(e.target.value)} className="h-10 w-full bg-transparent outline-none text-[#17183B] font-medium leading-none px-2"/>
      </Field>

      <Field title="Check out" className="col-span-1">
        <input type="date" value={checkOut} min={checkIn} onChange={(e)=>setCheckOut(e.target.value)} className="h-10 w-full bg-transparent outline-none text-[#17183B] font-medium leading-none px-2"/>
      </Field>

      <Field title="Rooms | Adults, Children" className="col-span-2 sm:col-span-1">
        <div className="flex flex-wrap items-center gap-3 text-[#17183B]">
          <SelectNumber label="Rooms" value={rooms} onChange={setRooms} min={1} max={8} />
          <span className="text-black/30">|</span>
          <SelectNumber label="Adults" value={adults} onChange={setAdults} min={1} max={10} />
          <span className="text-black/30">|</span>
          <SelectNumber label="Children" value={children} onChange={setChildren} min={0} max={10} />
        </div>
      </Field>

      <div className="col-span-2 lg:col-span-1 flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3 lg:px-4 lg:py-4">
        <button type="submit" className="h-10 bg-[#1E2352] text-white font-semibold rounded-lg px-5 sm:px-6 hover:opacity-90 transition w-full lg:w-auto whitespace-nowrap">
          Search
        </button>
      </div>
    </form>
  );
}

function Field({ title, children, className="" }:{title:string;children:React.ReactNode;className?:string;}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 w-full">
        <div className="flex flex-col w-full">
          <span className="text-[#17183B] font-medium text-sm sm:text-base leading-none whitespace-nowrap">{title}</span>
          <div className="text-sm leading-none pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
function SelectNumber({label,value,onChange,min,max}:{label:string;value:number;onChange:(v:number)=>void;min:number;max:number;}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e)=>onChange(Number(e.target.value))} className="h-10 bg-transparent outline-none font-medium leading-none whitespace-nowrap px-2 appearance-none" aria-label={label}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => <option key={n} value={n}>{n.toString().padStart(2,"0")}</option>)}
      </select>
    </label>
  );
}
