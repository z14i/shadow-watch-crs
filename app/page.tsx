// app/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CrimeForm from "@/components/common/CrimeFormModal";
import CrimeFormModal from "@/components/common/CrimeFormModal";

// Dynamically import the map client component
const MapView = dynamic(() => import("@/components/map/mapview"), { ssr: false });

export default function Home() {
  const handleFormSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/crimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      console.log("Form submitted successfully:", result);
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      throw error;
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Shadow Watch Crime Reporting System</h1>
        <p className="text-lg">View crime data on the map below and report a new incident.</p>
      </header>
      <main>
        <MapView />
      </main>
      <CrimeFormModal onSubmit={handleFormSubmit} />
    </div>
  );
}
