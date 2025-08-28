// app/hotels/page.tsx
import HotelsResultsClient from "./HotelsResultsClient";

export default function HotelsPage({
  searchParams,
}: {
  searchParams: {
    country?: string;
    checkIn?: string;
    checkOut?: string;
    rooms?: string;
    adults?: string;
    children?: string;
  };
}) {
  return (
    <div className="w-full">
      {/* верхняя цветная полоса */}
      <div className="w-full h-[200px] bg-[#1A1E43]" />
      <HotelsResultsClient initialParams={searchParams} />
    </div>
  );
}
