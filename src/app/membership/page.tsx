import { Suspense } from "react";
import MembershipClient from "./MembershipClient";

// не пытаемся статически пререндерить (у нас localStorage и чистый клиент)
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="px-4 sm:px-6 lg:px-[150px] pt-[96px] sm:pt-[112px] lg:pt-[126px] pb-16">
          Loading membership…
        </div>
      }
    >
      <MembershipClient />
    </Suspense>
  );
}
