"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** ===== DEMO-АВТОРИЗАЦИЯ НА LOCALSTORAGE =====
 *  НЕ для продакшена. Пароли не шифруются.
 *  Храним:
 *   - "auth.user": данные пользователя
 *   - "auth.session": "1" если вошёл
 */

type AuthUser = {
  username: string;
  email: string;
  password: string;       // demo only
  avatarDataUrl?: string; // base64
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
function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(LS_SESSION) === "1";
  } catch {
    return false;
  }
}
function setSession(flag: boolean) {
  try {
    flag
      ? localStorage.setItem(LS_SESSION, "1")
      : localStorage.removeItem(LS_SESSION);
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
        <span className="w-full h-full flex items-center justify-center text-white/90 font-bold">
          🙂
        </span>
      )}
    </span>
  );
}

export default function UserAuthWidget({
  variant = "desktop",
  onAction,
}: {
  variant?: "desktop" | "mobile";
  onAction?: () => void; // чтобы закрыть мобильное меню после действия
}) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [logged, setLogged] = useState(false);

  // состояние модалок
  const [open, setOpen] = useState<false | "login" | "register">(false);

  useEffect(() => {
    setMounted(true);
    const u = readUser();
    const s = isLoggedIn();
    setUser(u);
    setLogged(s && !!u);
  }, []);

  // Dropdown (desktop)
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
    setLogged(false);
    setUser(readUser());
    onAction?.();
  };

  const afterLogin = () => {
    setSession(true);
    setLogged(true);
    setUser(readUser());
    setOpen(false);
    onAction?.();
  };

  // Пока SSR → показываем “скелет”, чтобы не ловить гидрацию
  if (!mounted) {
    return variant === "desktop" ? (
      <div className="flex items-center gap-3">
        <div className="w-[100px] h-9 rounded bg-white/10 animate-pulse" />
        <div className="w-[90px] h-9 rounded bg-white/10 animate-pulse" />
      </div>
    ) : (
      <div className="w-full h-10 rounded bg-white/10 animate-pulse" />
    );
  }

  /* ---------------- РЕНДЕР ---------------- */
  if (logged && user) {
    // Залогинен → аватар + ник
    if (variant === "desktop") {
      return (
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
      );
    }

    // Mobile вариант
    return (
      <div className="rounded-[10px] bg-white/5 border border-white/15 p-3 text-white">
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
            onClick={onAction}
            className="h-10 rounded-md border border-white/25 grid place-items-center hover:bg-white/10"
          >
            Bookings
          </Link>
          <button
            onClick={logout}
            className="h-10 rounded-md border border-rose-300 text-rose-100 hover:bg-rose-500/10"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Незалогинен → кнопки
  if (variant === "desktop") {
    return (
      <div className="flex items-center gap-x-[19px] max-[1336px]:gap-x-3">
        <button
          onClick={() => setOpen("register")}
          className="px-[39px] py-[11px] rounded-[4px] text-white font-bold border border-white hover:bg-white/10 transition max-[1336px]:px-5 max-[1336px]:py-2 max-[1336px]:text-[13px]"
        >
          Register
        </button>
        <button
          onClick={() => setOpen("login")}
          className="px-[39px] py-[11px] rounded-[4px] text-[#222243] bg-white font-bold hover:opacity-90 transition max-[1336px]:px-5 max-[1336px]:py-2 max-[1336px]:text-[13px]"
        >
          Sign In
        </button>

        {open && (
          <AuthModal
            mode={open}
            onClose={() => setOpen(false)}
            onSuccess={afterLogin}
            onSwitchMode={(m) => setOpen(m)}
          />
        )}
      </div>
    );
  }

  // mobile
  return (
    <div className="flex gap-3">
      <button
        onClick={() => {
          setOpen("register");
        }}
        className="flex-1 text-center px-4 py-3 rounded-[6px] text-white font-semibold border border-white hover:bg-white/10 transition"
      >
        Register
      </button>
      <button
        onClick={() => {
          setOpen("login");
        }}
        className="flex-1 text-center px-4 py-3 rounded-[6px] text-[#222243] bg-white font-semibold hover:opacity-90 transition"
      >
        Sign In
      </button>

      {open && (
        <AuthModal
          mode={open}
          onClose={() => setOpen(false)}
          onSuccess={afterLogin}
          onSwitchMode={(m) => setOpen(m)}
        />
      )}
    </div>
  );
}

/* ============ МОДАЛКА (строго по центру) ============ */
function AuthModal({
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
}: {
  mode: "login" | "register";
  onClose: () => void;
  onSuccess: () => void;
  onSwitchMode: (m: "login" | "register") => void;
}) {
  const isLogin = mode === "login";

  // поля
  const [username, setUsername] = useState("");
  const [loginId, setLoginId] = useState(""); // email или username для логина
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 👇 блокируем прокрутку пока модалка открыта
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
      const id = loginId.trim();
      const idOk = id === u.email || id === u.username;
      if (!idOk) return setError("Wrong email/username.");
      if (pass !== u.password) return setError("Wrong password.");

      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        onSuccess();
        onClose();
      }, 500);
      return;
    }

    // register
    if (!username.trim() || !email.trim() || !pass.trim())
      return setError("Please fill all required fields.");
    if (pass.length < 6) return setError("Password must be at least 6 characters.");
    if (pass !== confirm) return setError("Passwords do not match.");

    const u: AuthUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: pass,
      avatarDataUrl: avatar,
      createdAt: new Date().toISOString(),
    };
    writeUser(u);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onSuccess();
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* затемнение с блюром */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* карточка строго по центру */}
      <div
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl outline outline-1 outline-black/10
                   transition-transform transition-opacity duration-200
                   data-[show=true]:opacity-100 data-[show=true]:scale-100 opacity-0 scale-95"
        onClick={(e) => e.stopPropagation()}
        data-show // триггерим класс для анимации (просто наличие атрибута)
      >
        <div className="sticky top-0 bg-[#1A1E43] text-white px-5 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isLogin ? "Sign In" : "Create account"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="p-5 grid gap-3">
          {!isLogin && (
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
                <div className="shrink-0">
                  <Avatar src={avatar} size={56} />
                </div>
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
          )}

          {isLogin && (
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

          <div className="text-xs text-black/60 mt-1">
            Demo only: data kept in your browser’s storage (localStorage). Don’t use real passwords.
          </div>

          <div className="mt-2 text-sm">
            {isLogin ? (
              <span>
                No account?{" "}
                <button
                  type="button"
                  className="text-[#1A1E43] underline"
                  onClick={() => {
                    setError(null);
                    onSwitchMode("register");
                  }}
                >
                  Create one
                </button>
                .
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#1A1E43] underline"
                  onClick={() => {
                    setError(null);
                    onSwitchMode("login");
                  }}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
