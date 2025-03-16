"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
  initialCenter?: { lat: number; lng: number };
}

export default function MapPicker({
  onLocationSelect,
  selectedLocation,
  initialCenter = { lat: 23.58, lng: 58.38 },
}: MapPickerProps) {
  // If the parent provides a selectedLocation, we'll use that.
  // Otherwise, we keep our own marker state from user clicks.
  const [localMarker, setLocalMarker] = useState<{ lat: number; lng: number } | null>(null);
  const marker = selectedLocation || localMarker;

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLocalMarker({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  const containerStyle = { width: "100%", height: "250px" };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={marker || initialCenter}
      zoom={12}
      onClick={handleClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
