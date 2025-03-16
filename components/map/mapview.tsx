
"use client";  

import { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';

interface Crime {
  id: number;
  report_details: string;
  crime_type: string;
  report_date_time: string;
  report_status: string;
  latitude: number;
  longitude: number;
  civil_id: string;
}

export default function MapView() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);

  useEffect(() => {
    async function fetchCrimes() {
      try {
        const res = await fetch('/api/crimes');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCrimes(data);
        console.log("Fetched crimes:", data);
      } catch (error) {
        console.error('Failed to fetch crimes:', error);
      }
    }
    fetchCrimes();
  }, []);

  const mapContainerStyle = { width: '100%', height: '600px' };
  const center = { lat: 23.58, lng: 58.38 };
  const zoom = 11;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={zoom}>
        {crimes.map((crime) => (
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
              <h3>{selectedCrime.crime_type}</h3>
              <p>{selectedCrime.report_details}</p>
              <p>Status: {selectedCrime.report_status}</p>
              <p>Reported: {selectedCrime.report_date_time}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
