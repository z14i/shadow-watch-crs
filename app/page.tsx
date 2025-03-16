"use client"
import CrimeList from "@/components/common/crimelist";
import MapView from "@/components/map/mapview";

export default function Home() {
  return (
    <div>
      <h1>Shadow Watch Crime Reporting System</h1>
      <MapView />
      <CrimeList/>
    </div>
  );
}
