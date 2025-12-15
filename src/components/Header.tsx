"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ======== локальная демо-авторизация ======== */
type AuthUser = {
  username: string;
  email: string;
  password: string;
  avatarDataUrl?: string;
  createdAt: string;
};
const LS_USER = "auth.user";
const LS_SESSION = "auth.session";

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(LS_SESSION) === "1";
  } catch {
    return false;
  }
}
function setSession(flag: boolean) {
  try {
    flag ? localStorage.setItem(LS_SESSION, "1") : localStorage.removeItem(LS_SESSION);
  } catch {}
}
function notifyAuthChanged() {
  try {
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}
}

function Avatar({ src, size = 36 }: { src?: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full bg-[#FEBB02]/20 border border-white/40 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-white/90 font-bold">🙂</span>
      )}
    </span>
  );
}

export default function Header() {
  const menu = [
    { text: "home", href: "/" },
    { text: "services", href: "/services" },
    { text: "bookings", href: "/bookings" },
    { text: "explore", href: "/explore" },
    { text: "membership", href: "/membership" },
  ];
  const [open, setOpen] = useState(false);

  // состояние авторизации
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [logged, setLogged] = useState(false);
  const pathname = usePathname();

  const refreshAuth = () => {
    const u = readUser();
    const s = isLoggedIn();
    setUser(u);
    setLogged(s && !!u);
  };

  useEffect(() => {
    setMounted(true);
    refreshAuth();

    // из других вкладок
    const onStorage = () => refreshAuth();
    window.addEventListener("storage", onStorage);

    // наш кастомный сигнал (срабатывает в этой же вкладке)
    const onAuthChanged = () => refreshAuth();
    window.addEventListener("auth:changed", onAuthChanged as EventListener);

    // при возврате фокуса
    const onFocus = () => refreshAuth();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged as EventListener);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // обновляем при смене маршрута
  useEffect(() => {
    if (mounted) refreshAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // dropdown
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = () => {
    setSession(false);
    setDdOpen(false);
    setOpen(false);
    refreshAuth();
    notifyAuthChanged();
  };

  return (
    <header
  className={`
    fixed top-0 left-0 right-0 z-[60] bg-[#1A1E43]/90 backdrop-blur
    ${open ? "h-[100dvh] overflow-y-auto overscroll-contain" : ""}
  `}
>
      <div className="w-full h-[72px] sm:h-[88px] lg:h-[100px] flex justify-between items-center px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[5px] max-[1336px]:px-6">
        {/* logo */}
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/MainPage/Logo.svg"
            alt="Logo"
            className="w-[160px] sm:w-[200px] lg:w-[220px] max-[1336px]:w-[200px] h-[32px] sm:h-[38px] lg:h-[40px]"
          />
        </Link>

        {/* desktop */}
        <div className="hidden lg:flex items-center gap-x-[48.5px] max-[1336px]:gap-x-6">
          <nav className="flex gap-x-[28px] max-[1336px]:gap-x-4 items-center">
            {menu.map((m) => (
              <Link
                key={m.text}
                href={m.href}
                className="uppercase text-[14px] flex items-center text-white hover:text-[#FEBB02] transition"
              >
                {m.text}
              </Link>
            ))}
          </nav>

          {mounted && logged && user ? (
            <div className="relative" ref={ddRef}>
              <button
                onClick={() => setDdOpen((v) => !v)}
                className="inline-flex items-center gap-3 text-white hover:text-[#FEBB02] transition"
              >
                <span className="truncate max-w-[140px]">{user.username}</span>
                <Avatar src={user.avatarDataUrl} />
              </button>

              {ddOpen && (
                <div className="absolute right-0 mt-2 w-[220px] rounded-lg bg-white shadow-[0_12px_24px_rgba(0,0,0,0.15)] border border-black/10 overflow-hidden z-[70]">
                  <div className="px-3 py-3 flex items-center gap-3 border-b border-black/10">
                    <Avatar src={user.avatarDataUrl} size={40} />
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1A1E43] truncate">{user.username}</div>
                      <div className="text-xs text-black/60 truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid">
                    <Link href="/bookings" className="px-4 py-2 text-sm hover:bg-black/5">
                      My bookings
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-x-[19px] max-[1336px]:gap-x-3">
              <Link
                href="/auth?mode=register"
                className="px-[39px] py-[11px] rounded-[4px] text-white font-bold border border-white hover:bg-white/10 transition max-[1336px]:px-5 max-[1336px]:py-2 max-[1336px]:text-[13px]"
              >
                Register
              </Link>
              <Link
                href="/auth?mode=login"
                className="px-[39px] py-[11px] rounded-[4px] text-[#222243] bg-white font-bold hover:opacity-90 transition max-[1336px]:px-5 max-[1336px]:py-2 max-[1336px]:text-[13px]"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* mobile / tablet */}
        <div className="lg:hidden flex items-center">
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/25 text-white hover:bg-white/10 transition"
          >
            <span className="relative block w-5 h-5">
              <span
                className={`absolute inset-x-0 top-1 block h-[2px] bg-white transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-white transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-1 block h-[2px] bg-white transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[72px] sm:top-[88px] bg-black/30 lg:hidden"
          />
          <div className="lg:hidden fixed left-0 right-0 top-[72px] sm:top-[88px] bg-[#1A1E43] border-t border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.25)]">
            <nav className="px-4 sm:px-6 py-4 grid gap-2">
              {menu.map((m) => (
                <Link
                  key={m.text}
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className="uppercase text-white/95 hover:text-[#FEBB02] transition text-[14px] py-3 border-b border-white/10 last:border-b-0"
                >
                  {m.text}
                </Link>
              ))}
            </nav>

            {mounted && logged && user ? (
              <div className="px-4 sm:px-6 pb-4 pt-2 text-white">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatarDataUrl} />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{user.username}</div>
                    <div className="text-xs text-white/80 truncate">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/bookings"
                    onClick={() => setOpen(false)}
                    className="h-10 rounded-md border border-white/25 grid place-items-center hover:bg-white/10"
                  >
                    Bookings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="h-10 rounded-md border border-rose-300 text-rose-100 hover:bg-rose-500/10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 sm:px-6 pb-4 pt-2 flex gap-3">
                <Link
                  href="/auth?mode=register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-[6px] text-white font-semibold border border-white hover:bg-white/10 transition"
                >
                  Register
                </Link>
                <Link
                  href="/auth?mode=login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-[6px] text-[#222243] bg-white font-semibold hover:opacity-90 transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
