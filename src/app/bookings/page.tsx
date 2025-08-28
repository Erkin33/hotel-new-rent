import BookingsClient from "./BookingsClient";

export default function BookingsPage() {
  return (
    <div className="w-full ">
      {/* верхняя полоса для отступа под header */}
      <div className="w-full h-[300px] bg-[#1A1E43]" />
      <BookingsClient />
    </div>
  );
}
