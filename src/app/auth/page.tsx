// server component
import AuthClient from "../auth/AuthClient";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; returnTo?: string }>;
}) {
  const sp = await searchParams;

  const mode = (sp?.mode === "login" ? "login" : "register") as "login" | "register";
  const returnTo = sp?.returnTo || "/";

  return (
    <div className="w-full">
      {/* верхняя полоса как на других страницах */}
      <div className="w-full h-[200px] bg-[#1A1E43]" />
      <AuthClient initialMode={mode} returnTo={returnTo} />
    </div>
  );
}
