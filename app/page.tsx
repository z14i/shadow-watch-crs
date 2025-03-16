// app/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CrimeForm from "@/components/common/CrimeForm";

// Dynamically import the map client component
const MapView = dynamic(() => import("@/components/map/mapview"), { ssr: false });

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Shadow Watch Crime Reporting System</h1>
        <p>View crime data on the map below and report a new incident.</p>
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Hide Report Form" : "Report a Crime"}
        </button>
      </header>
      <main>
        <MapView/>
        
          <section style={{ marginTop: "2rem" }}>
            <CrimeForm />
          </section>
       
      </main>
    </div>
  );
}
