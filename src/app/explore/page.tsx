"use client"
// src/app/explore/page.tsx
import ExploreClient from "./ExploreClient";

export default function ExplorePage() {
  return (
    <div className="w-full">
      <div className="w-full h-[200px] bg-[#1A1E43]" />
      <ExploreClient />
    </div>
  );
}
