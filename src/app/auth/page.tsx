// server component
import AuthClient from "../auth/AuthClient";

export default function AuthPage({
  searchParams,
}: {
  searchParams: { mode?: string; returnTo?: string };
}) {
  const mode = (searchParams?.mode === "login" ? "login" : "register") as "login" | "register";
  const returnTo = searchParams?.returnTo || "/";
  return (
    <div className="w-full">
      {/* верхняя полоса как на других страницах */}
      <div className="w-full h-[200px] bg-[#1A1E43]" />
      <AuthClient initialMode={mode} returnTo={returnTo} />
    </div>
  );
}
