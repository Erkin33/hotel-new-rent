"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ===== демо-авторизация на localStorage ===== */
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
function writeUser(u: AuthUser) {
  try {
    localStorage.setItem(LS_USER, JSON.stringify(u));
  } catch {}
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

/* ===== UI ===== */
function AvatarPreview({ src, size = 64 }: { src?: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full bg-[#FEBB02]/15 border border-black/10 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full flex items-center justify-center">🙂</span>
      )}
    </span>
  );
}

export default function AuthClient({
  initialMode = "register",
  returnTo = "/",
}: {
  initialMode?: "login" | "register";
  returnTo?: string;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  useEffect(() => setMounted(true), []);

  // поля
  const isLogin = mode === "login";
  const [username, setUsername] = useState("");
  const [loginId, setLoginId] = useState(""); // email или username для входа
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPickAvatar = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const u = readUser();
      if (!u) return setError("No account found. Please register first.");
      const okId = loginId.trim().toLowerCase();
      const matchId = okId === u.email.toLowerCase() || okId === u.username.toLowerCase();
      if (!matchId) return setError("Wrong email/username.");
      if (pass !== u.password) return setError("Wrong password.");

      setBusy(true);
      setTimeout(() => {
        setSession(true);
        notifyAuthChanged();
        setBusy(false);
        router.push(returnTo || "/");
      }, 400);
      return;
    }

    // register
    if (!username.trim() || !email.trim() || !pass.trim()) return setError("Please fill all required fields.");
    if (pass.length < 6) return setError("Password must be at least 6 characters.");
    if (pass !== confirm) return setError("Passwords do not match.");

    const u: AuthUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: pass,
      avatarDataUrl: avatar,
      createdAt: new Date().toISOString(),
    };

    setBusy(true);
    setTimeout(() => {
      writeUser(u);
      setSession(true);
      notifyAuthChanged();
      setBusy(false);
      router.push(returnTo || "/");
    }, 400);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-[150px] max-[1150px]:!px-[75px] max-[600px]:!px-[6px] -mt-16 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левый — промо */}
        <section className="rounded-2xl p-6 lg:p-10 bg-gradient-to-br from-[#1A1E43] via-[#1f2a6b] to-[#0b1025] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <h1 className="text-[26px] sm:text-[32px] lg:text-[40px] font-extrabold leading-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-white/90 max-w-xl">
            Access exclusive prices, track bookings and sync wishlists across devices.
          </p>
          <ul className="mt-4 space-y-2 text-white/90">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB02]" />
              Member-only deals & VIP perks
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB02]" />
              Save your searches and favorites
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBB02]" />
              Manage bookings in one place
            </li>
          </ul>
          <div className="mt-6 rounded-xl bg-white/10 border border-white/15 p-4 text-sm">
            Demo only: your data is stored in the browser (localStorage). Don’t use real passwords.
          </div>
        </section>

        {/* Правый — форма */}
        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:p-8">
          {/* переключатель */}
          <div className="mb-4 inline-flex rounded-xl border border-black/10 p-1 bg-[#F9FAFB]">
            <button
              onClick={() => setMode("register")}
              className={`h-10 px-4 rounded-lg ${!isLogin ? "bg-white border border-black/10 font-semibold" : "text-black/70"}`}
            >
              Create account
            </button>
            <button
              onClick={() => setMode("login")}
              className={`h-10 px-4 rounded-lg ${isLogin ? "bg-white border border-black/10 font-semibold" : "text-black/70"}`}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={submit} className="grid gap-3">
            {!isLogin ? (
              <>
                <label className="text-sm font-medium text-[#222243]">
                  Username *
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <label className="text-sm font-medium text-[#222243]">
                  Email *
                  <input
                    type="email"
                    className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <div className="flex items-center gap-3">
                  <AvatarPreview src={avatar} />
                  <label className="text-sm text-[#222243]">
                    <span className="block mb-1 font-medium">Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onPickAvatar(e.target.files?.[0])}
                      className="text-sm"
                    />
                  </label>
                </div>
              </>
            ) : (
              <label className="text-sm font-medium text-[#222243]">
                Email or Username *
                <input
                  className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </label>
            )}

            <label className="text-sm font-medium text-[#222243]">
              Password *
              <input
                type="password"
                className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </label>

            {!isLogin && (
              <label className="text-sm font-medium text-[#222243]">
                Confirm password *
                <input
                  type="password"
                  className="mt-1 h-10 w-full rounded-md border border-black/10 px-3 outline-none"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
            )}

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <button
              disabled={busy}
              className="mt-1 h-11 rounded-md bg-[#1E2352] text-white font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Please wait..." : isLogin ? "Sign In" : "Create account"}
            </button>

            <div className="mt-2 text-sm">
              {isLogin ? (
                <span>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-[#1A1E43] underline"
                    onClick={() => setMode("register")}
                  >
                    Create one
                  </button>
                  .
                </span>
              ) : (
                <span>
                  Already registered?{" "}
                  <button
                    type="button"
                    className="text-[#1A1E43] underline"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
