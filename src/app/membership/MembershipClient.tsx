"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ---------- helpers ---------- */
const cls = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type PlanKey = "free" | "plus" | "pro";
type Plan = {
  key: PlanKey;
  title: string;
  monthly: number;
  perks: string[];
  badge?: string;
};

const PLANS: Plan[] = [
  { key: "free", title: "Free", monthly: 0, perks: ["Member-only deals", "Email support", "Wishlist sync"] },
  { key: "plus", title: "Plus", monthly: 12, perks: ["Extra −5% on hotels", "Priority chat", "Price match", "Free breakfast badges"], badge: "Popular" },
  { key: "pro", title: "Pro", monthly: 29, perks: ["−10% on bundles", "Concierge 24/7", "Lounge passes", "Expense export", "VIP upgrades"] },
];

export default function MembershipClient() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<PlanKey>("free"); // стабильный initial

  useEffect(() => {
    try {
      const saved = localStorage.getItem("membershipPlan") as PlanKey | null;
      if (saved === "free" || saved === "plus" || saved === "pro") setSelected(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("membershipPlan", selected);
    } catch {}
  }, [selected]);

  const savePct = 20;
  const price = (p: Plan) => (period === "monthly" ? p.monthly : Math.round(p.monthly * 12 * (1 - savePct / 100)));

  return (
    <main
      className={cls(
        // контейнер по центру, без горизонтального скролла страницы
        "mx-auto w-full overflow-x-clip",
        // компактные внутренние отступы на мобилке
        "px-4 sm:px-6 lg:px-8",
        // ширина контейнера
        "max-w-[1120px]",
        "pt-[96px] sm:pt-[112px] lg:pt-[126px] pb-20"
      )}
    >
      {/* HERO */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1A1E43] via-[#1f2a6b] to-[#0b1025] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] p-5 sm:p-7 lg:p-10 max-[1024px]:rounded-xl">
        <h1 className="font-extrabold leading-tight text-[26px] sm:text-[30px] lg:text-[40px] max-[1024px]:text-[24px]">
          Membership that pays for itself
        </h1>
        <p className="mt-2 text-white/90 max-w-2xl max-[1024px]:text-sm">
          Get exclusive prices, free upgrades and human help 24/7. Switch plans any time.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/20 p-1 max-[1024px]:rounded-lg">
          <button
            onClick={() => setPeriod("monthly")}
            className={cls("px-4 h-10 rounded-lg transition max-[1024px]:h-9 max-[1024px]:px-3", period === "monthly" ? "bg-white text-[#1A1E43]" : "text-white/90")}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cls("px-4 h-10 rounded-lg transition max-[1024px]:h-9 max-[1024px]:px-3", period === "yearly" ? "bg-white text-[#1A1E43]" : "text-white/90")}
          >
            Yearly <span className="ml-1 text-[#FEBB02]">−{savePct}%</span>
          </button>
        </div>
      </section>

      {/* PLANS */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-[1024px]:gap-3">
        {PLANS.map((p) => {
          const isSel = selected === p.key;
          const priceVal = price(p);
          const subtitle = period === "monthly" ? (p.monthly === 0 ? "forever" : "/ month") : p.monthly === 0 ? "forever" : "/ year";

          return (
            <article
              key={p.key}
              className={cls(
                "relative rounded-2xl border bg-white transition hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-5",
                "max-[1024px]:rounded-xl max-[1024px]:p-4 max-[420px]:p-3",
                isSel ? "border-[#1E2352] ring-2 ring-[#1E2352]/20" : "border-black/10"
              )}
            >
              {p.badge && (
                <span className="absolute -top-3 left-4 px-2 py-1 rounded-md bg-emerald-500 text-white text-xs max-[1024px]:-top-2"> {p.badge} </span>
              )}

              <h3 className="text-lg font-bold text-[#1A1E43] max-[1024px]:text-base">{p.title}</h3>

              {/* Цена сверху, подпись снизу на мобиле */}
              <div className="mt-2 flex flex-col items-start gap-0 sm:flex-row sm:items-end sm:gap-1">
                <div className="text-3xl font-extrabold text-[#F59E0B] max-[1024px]:text-2xl">
                  {p.monthly === 0 ? "Free" : fmtUSD(priceVal)}
                </div>
                <div className="text-sm text-black/60 max-[1024px]:text-xs">{subtitle}</div>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm text-black/80 max-[1024px]:text-[13px]">
                {p.perks.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {x}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelected(p.key)}
                className={cls(
                  "mt-4 h-10 w-full rounded-lg font-semibold max-[1024px]:h-9",
                  isSel ? "bg-[#1E2352] text-white" : "bg-white border border-black/15 hover:bg-black/5"
                )}
              >
                {isSel ? "Selected" : "Choose plan"}
              </button>
            </article>
          );
        })}
      </section>

      {/* CALCULATORS */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 max-[1024px]:gap-4">
        <SavingsCalculator period={period} plan={selected} />
        <ReferralWidget />
      </section>

      {/* COMPARISON TABLE */}
      <Comparison />

      {/* FAQ + CTA */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 max-[1024px]:gap-4">
        <FAQ />
        <aside className="lg:col-span-1 rounded-2xl border border-black/10 bg-white p-5 max-[1024px]:rounded-xl max-[1024px]:p-4">
          <h3 className="text-lg font-bold text-[#1A1E43] max-[1024px]:text-base">Ready to travel smarter?</h3>
          <p className="mt-1 text-sm text-black/70 max-[1024px]:text-[13px]">
            Members get better prices on 90%+ of stays. Try Plus for a month — cancel any time.
          </p>
          <Link
            href="/hotels"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1E2352] text-white font-semibold hover:opacity-90 max-[1024px]:h-9"
          >
            Explore hotels
          </Link>
          <p className="mt-2 text-[11px] text-black/60">We’ll remember your plan across devices.</p>
        </aside>
      </section>
    </main>
  );
}

/* ---------- Savings calculator ---------- */
function SavingsCalculator({ period, plan }: { period: "monthly" | "yearly"; plan: PlanKey }) {
  const [nights, setNights] = useState(6);
  const [avg, setAvg] = useState(220);
  const [bundles, setBundles] = useState(1);

  const mult = plan === "pro" ? 0.1 : plan === "plus" ? 0.05 : 0;
  const bundleBonus = plan === "pro" ? 0.05 : 0;
  const baseSpend = nights * avg;
  const bundleSpend = bundles * avg * 2;
  const save = Math.round(baseSpend * mult + bundleSpend * (mult + bundleBonus));

  const fee =
    plan === "free" ? 0 : plan === "plus" ? (period === "monthly" ? 12 : Math.round(12 * 12 * 0.8)) : period === "monthly" ? 29 : Math.round(29 * 12 * 0.8);

  const net = save - fee;

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 max-[1024px]:rounded-xl max-[1024px]:p-4">
      <h3 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">Will it pay off?</h3>

      {/* на мобиле — В КОЛОНКУ */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 max-[1024px]:gap-2.5">
        <Slider label="Nights / year" value={nights} setValue={setNights} min={0} max={30} />
        <Slider label="Avg. price" value={avg} setValue={setAvg} min={80} max={600} step={10} prefix="$" />
        <Slider label="Bundles" value={bundles} setValue={setBundles} min={0} max={6} />
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-[1024px]:gap-2.5">
        <StatCard title="Estimated savings" value={`+${fmtUSD(save)}`} accent />
        <StatCard title="Membership cost" value={fee ? `−${fmtUSD(fee)}` : "$0"} />
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-black/15 p-3 bg-[#F9FAFB]">
        <div className="flex items-center justify-between text-lg font-extrabold max-[1024px]:text-base">
          <span>Net benefit</span>
          <span className={cls(net >= 0 ? "text-emerald-600" : "text-rose-600")}>{net >= 0 ? "+" : ""}{fmtUSD(net)}</span>
        </div>
        <p className="mt-1 text-[11px] text-black/60">
          Rough estimate. We apply {plan === "pro" ? "10%" : plan === "plus" ? "5%" : "0%"} off stays{plan === "pro" ? " + extra 5% on bundles" : ""}.
        </p>
      </div>
    </article>
  );
}

/* ---------- Progress bar ---------- */
function ProgressBar({ value, min, max }: { value: number; min: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-black/10 overflow-hidden">
      <div className="h-full rounded-full bg-[#1E2352]" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Slider({
  label, value, setValue, min, max, step = 1, prefix = "",
}: {
  label: string; value: number; setValue: (n: number) => void; min: number; max: number; step?: number; prefix?: string;
}) {
  return (
    <label className="rounded-xl border border-black/10 p-3 max-[1024px]:p-3 max-[420px]:p-2.5">
      <div className="text-xs text-black/60">{label}</div>

      {/* Значение сверху */}
      <div className="mt-1 font-semibold max-[1024px]:text-sm">{prefix}{value}</div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        className="mt-2 w-full"
        aria-label={label}
      />

      <ProgressBar value={value} min={min} max={max} />
    </label>
  );
}

function StatCard({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className={cls("rounded-xl border p-3 max-[1024px]:p-3", accent ? "border-emerald-300 bg-emerald-50" : "border-black/10 bg-white")}>
      <div className="text-xs text-black/60">{title}</div>
      <div className="text-xl font-extrabold max-[1024px]:text-lg">{value}</div>
    </div>
  );
}

/* ---------- Referral widget ---------- */
function ReferralWidget() {
  const [friends, setFriends] = useState(3);
  const bonus = friends * 12;
  const freeNights = Math.floor(bonus / 220);

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 max-[1024px]:rounded-xl max-[1024px]:p-4">
      <h3 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">Invite friends, travel free</h3>
      <p className="text-sm text-black/70 max-[1024px]:text-[13px]">
        Share your link and both of you get <b>$12</b>. Your bonus never expires.
      </p>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 max-[1024px]:gap-2.5">
        <Slider label="Friends invited" value={friends} setValue={setFriends} min={0} max={50} />
        <StatCard title="Bonus" value={`+${fmtUSD(bonus)}`} accent />
        <StatCard title="Free nights (est.)" value={`${freeNights}`} />
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-black/15 p-3 bg-[#F9FAFB] text-sm max-[1024px]:text-xs">
        Your link: <code className="px-2 py-1 rounded bg-white border border-black/10">logoi.sum/invite/you</code>
      </div>
    </article>
  );
}

/* ---------- Comparison table ---------- */
function Comparison() {
  const headers = ["Perk", "Free", "Plus", "Pro"] as const;
  const rows = [
    ["Member-only prices", "✓", "✓✓", "✓✓✓"],
    ["Extra % off stays", "—", "−5%", "−10%"],
    ["Support", "Email", "Priority chat", "Concierge 24/7"],
    ["Bundles discount", "—", "—", "−5% extra"],
    ["Lounge passes", "—", "—", "Included"],
    ["Expense export", "—", "—", "✓"],
  ] as const;

  return (
    <section className="mt-6 rounded-2xl border border-black/10 overflow-hidden max-[1024px]:rounded-xl">
      <div className="bg-[#1A1E43] text-white px-5 py-3 font-semibold max-[1024px]:px-4 max-[1024px]:py-2.5">Compare plans</div>

      <div className="bg-white p-0">
        {/* отдельный горизонтальный скролл только для таблицы */}
        <div className="overflow-x-auto px-2">
          <table className="min-w-[640px] w-full">
            <thead>
              <tr className="bg-[#F9FAFB] text-left text-sm max-[1024px]:text-xs">
                {headers.map((h) => (
                  <th key={h} className="px-4 py-3 border-b border-black/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm max-[1024px]:text-xs">
              {rows.map((r, i) => (
                <tr key={i} className="odd:bg-white even:bg-[#FCFCFD]">
                  <td className="px-4 py-3 border-b border-black/10">{r[0]}</td>
                  <td className="px-4 py-3 border-b border-black/10">{r[1]}</td>
                  <td className="px-4 py-3 border-b border-black/10">{r[2]}</td>
                  <td className="px-4 py-3 border-b border-black/10">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const data = [
    { q: "Can I cancel any time?", a: "Yes, plans are month-to-month. Yearly plans get a discount and renew annually." },
    { q: "Does Plus/Pro work on every hotel?", a: "The extra % off applies on most partnered hotels and all bundles unless marked otherwise." },
    { q: "Is there a family plan?", a: "Pro lets you share benefits with up to 3 co-travelers in the same booking." },
    { q: "Money-back guarantee?", a: "If you save less than the fee in your first month, we’ll refund the difference — seriously." },
  ];

  return (
    <section className="lg:col-span-2 rounded-2xl border border-black/10 bg-white p-5 max-[1024px]:rounded-xl max-[1024px]:p-4">
      <h3 className="text-lg font-semibold text-[#1A1E43] max-[1024px]:text-base">FAQ</h3>
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
              <span className="w-6 h-6 grid place-items-center rounded-md border border-black/10">{open === i ? "−" : "+"}</span>
            </summary>
            <p className="mt-2 text-sm text-black/70 max-[1024px]:text-[13px]">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
