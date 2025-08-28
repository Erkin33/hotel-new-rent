import MainBanner from "@/components/MainBanner";
import TopRated from "@/components/toprated";
import Category from "@/components/category";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
        <MainBanner />
        <TopRated />
        <Category />
      </main>
  );
}
