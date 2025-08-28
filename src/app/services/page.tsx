import ServicesClient from "./ServicesClient";

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* верхняя цветная полоса под фиксированный header */}
      <div className="w-full h-[220px] bg-[#1A1E43]" />
      <ServicesClient />
    </div>
  );
}
