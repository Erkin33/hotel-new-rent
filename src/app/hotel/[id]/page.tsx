import { use } from "react";
import HotelDetailsClient from "./ui/HotelDetailsClient";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // в Next 15 params — Promise, распаковываем:
  const { id } = use(params);

  return <HotelDetailsClient id={id} />;
}
