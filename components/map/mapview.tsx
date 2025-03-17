"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";

interface Crime {
  id: number;
  report_details: string;
  crime_type: string;
  report_date_time: string; // Format: "YYYY-MM-DD-HH-MM"
  report_status: string;
  latitude: number;
  longitude: number;
  civil_id: string;
}

const CRIME_TYPES = ["Robbery", "Assault", "Homicide", "Kidnapping", "Theft"];

export default function MapView() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Search-related state
  const [searchField, setSearchField] = useState<string>("all"); // "all", "crimeType", "id", "reportDateRange"
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchStart, setSearchStart] = useState<string>(""); // from datetime-local input ("YYYY-MM-DDTHH:MM")
  const [searchEnd, setSearchEnd] = useState<string>("");     // from datetime-local input ("YYYY-MM-DDTHH:MM")

  useEffect(() => {
    async function fetchCrimes() {
      try {
        const res = await fetch("/api/crimes");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCrimes(data);
        console.log("Fetched crimes:", data);
      } catch (error) {
        console.error("Failed to fetch crimes:", error);
      }
    }
    fetchCrimes();
  }, []);

  // Helper: Convert "YYYY-MM-DD-HH-MM" to a Date object.
  const parseCrimeDate = (dateStr: string): Date => {
    // Convert "2025-03-16-23-30" to "2025-03-16T23:30:00"
    const isoString = dateStr.substring(0, 10) + "T" + dateStr.substring(11) + ":00";
    return new Date(isoString);
  };

  // Helper: Convert datetime-local input ("YYYY-MM-DDTHH:MM") to a Date object.
  const parseInputDate = (input: string): Date => new Date(input);

  // Filtering logic:
  const filteredCrimes = crimes.filter((crime) => {
    // Filter by selected crime types:
    const matchesTypeFilter =
      selectedTypes.length > 0 ? selectedTypes.includes(crime.crime_type) : true;
      
    // Filter by search criteria:
    let matchesSearch = true;
    if (searchField === "all") {
      const term = searchTerm.toLowerCase();
      matchesSearch =
        term === "" ||
        crime.crime_type.toLowerCase().includes(term) ||
        crime.report_date_time.toLowerCase().includes(term) ||
        crime.id.toString().includes(term);
    } else if (searchField === "crimeType") {
      matchesSearch = crime.crime_type.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === "id") {
      matchesSearch = crime.id.toString().includes(searchTerm);
    } else if (searchField === "reportDateRange") {
      // Only filter if both start and end dates are provided.
      if (searchStart && searchEnd) {
        const crimeDate = parseCrimeDate(crime.report_date_time).getTime();
        const startDate = parseInputDate(searchStart).getTime();
        const endDate = parseInputDate(searchEnd).getTime();
        matchesSearch = crimeDate >= startDate && crimeDate <= endDate;
      }
    }
    return matchesTypeFilter && matchesSearch;
  });

  // Toggle a crime type in the selectedTypes array.
  const handleFilterChange = (crimeType: string) => {
    setSelectedTypes((prev) =>
      prev.includes(crimeType)
        ? prev.filter((type) => type !== crimeType)
        : [...prev, crimeType]
    );
  };

  // Map container settings.
  const mapContainerStyle = { width: "100%", height: "600px" };
  const center = { lat: 23.58, lng: 58.38 };
  const zoom = 11;

  return (
    <>
      
      <div className="mb-4 p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row gap-4">
          
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Search Field:</label>
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearchTerm("");
                setSearchStart("");
                setSearchEnd("");
              }}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="all">All</option>
              <option value="crimeType">Crime Type</option>
              <option value="id">ID</option>
              <option value="reportDateRange">Report Date Range</option>
            </select>
          </div>
          <div className="flex-1">
            {searchField === "reportDateRange" ? (
              <div className="flex flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Start Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={searchStart}
                    onChange={(e) => setSearchStart(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">End Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={searchEnd}
                    onChange={(e) => setSearchEnd(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-1">Search:</label>
                <input
                  type="text"
                  placeholder="Search by type, date, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-semibold mb-2 hidden">Filter Crime Types:</p>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-gray-300">
            {CRIME_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-4 py-2 inline-block rounded-t-md focus:outline-none transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-blue-500 text-white border-b-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } text-sm md:text-base`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Rendering */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={zoom}>
          {filteredCrimes.map((crime) => (
            <Marker
              key={crime.id}
              position={{ lat: crime.latitude, lng: crime.longitude }}
              onClick={() => setSelectedCrime(crime)}
            />
          ))}
          {selectedCrime && (
            <InfoWindow
              position={{ lat: selectedCrime.latitude, lng: selectedCrime.longitude }}
              onCloseClick={() => setSelectedCrime(null)}
            >
              <div>
                <h3 className="font-bold">{selectedCrime.crime_type}</h3>
                <p>{selectedCrime.report_details}</p>
                <p className="text-sm">Status: {selectedCrime.report_status}</p>
                <p className="text-xs">Reported: {selectedCrime.report_date_time}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
}
