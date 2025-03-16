"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to ensure it only loads on the client.
const MapPicker = dynamic(() => import("../map/MapPicker"), { ssr: false });

export interface FormData {
  report_details: string;
  crime_type: string;
  civil_id: string;
  latitude: string;
  longitude: string;
}

interface CrimeFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function CrimeForm({ onClose, onSubmit }: CrimeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    report_details: "",
    crime_type: "",
    civil_id: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    if (!formData.report_details.trim())
      newErrors.report_details = "Report details are required.";
    if (!formData.crime_type)
      newErrors.crime_type = "Crime type is required.";
    if (!formData.civil_id)
      newErrors.civil_id = "Civil ID is required.";
    else if (!/^\d{7}$/.test(formData.civil_id))
      newErrors.civil_id = "Civil ID must be exactly 7 digits.";
    if (!formData.latitude)
      newErrors.latitude = "Latitude is required.";
    else if (
      isNaN(Number(formData.latitude)) ||
      Number(formData.latitude) < -90 ||
      Number(formData.latitude) > 90
    )
      newErrors.latitude = "Latitude must be a number between -90 and 90.";
    if (!formData.longitude)
      newErrors.longitude = "Longitude is required.";
    else if (
      isNaN(Number(formData.longitude)) ||
      Number(formData.longitude) < -180 ||
      Number(formData.longitude) > 180
    )
      newErrors.longitude = "Longitude must be a number between -180 and 180.";
    return newErrors;
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setFormData({ ...formData, latitude: lat, longitude: lng });
          setErrors({ ...errors, latitude: undefined, longitude: undefined });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to get your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      alert("Crime reported successfully!");
      setFormData({
        report_details: "",
        crime_type: "",
        civil_id: "",
        latitude: "",
        longitude: "",
      });
      onClose();
    } catch (error: any) {
      console.error("Failed to submit crime:", error);
      alert("Failed to report crime: " + error.message);
    }
    setIsSubmitting(false);
  };

  // If latitude and longitude are provided, pass them as selectedLocation to MapPicker.
  const selectedLocation =
    formData.latitude && formData.longitude
      ? { lat: Number(formData.latitude), lng: Number(formData.longitude) }
      : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Report Details */}
      <div>
        <label className="block text-sm font-medium">Report Details:</label>
        <input
          type="text"
          name="report_details"
          value={formData.report_details}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
        {errors.report_details && (
          <p className="text-red-600 text-xs">{errors.report_details}</p>
        )}
      </div>

      {/* Crime Type */}
      <div>
        <label className="block text-sm font-medium">Crime Type:</label>
        <select
          name="crime_type"
          value={formData.crime_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        >
          <option value="">Select a crime type</option>
          <option value="Robbery">Robbery</option>
          <option value="Assault">Assault</option>
          <option value="Homicide">Homicide</option>
          <option value="Kidnapping">Kidnapping</option>
          <option value="Theft">Theft</option>
        </select>
        {errors.crime_type && (
          <p className="text-red-600 text-xs">{errors.crime_type}</p>
        )}
      </div>

      {/* Civil ID */}
      <div>
        <label className="block text-sm font-medium">Civil ID (7 digits):</label>
        <input
          type="text"
          name="civil_id"
          value={formData.civil_id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
          pattern="\d{7}"
          title="Please enter exactly 7 digits."
        />
        {errors.civil_id && (
          <p className="text-red-600 text-xs">{errors.civil_id}</p>
        )}
      </div>

      {/* Map Section with Integrated Location Inputs and Locate Me Button */}
      <div className="relative w-full h-64 rounded-md overflow-hidden border border-gray-300">
        {/* Map Picker */}
        <MapPicker
          onLocationSelect={(lat, lng) => {
            setFormData({
              ...formData,
              latitude: lat.toString(),
              longitude: lng.toString(),
            });
          }}
          selectedLocation={selectedLocation}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 flex flex-row items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-white">Latitude:</label>
            <input
              type="number"
              name="latitude"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-1 text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-white">Longitude:</label>
            <input
              type="number"
              name="longitude"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-1 text-sm"
              required
            />
          </div>
          <div>
            <Button
              onPress={handleLocateMe}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Locate Me
            </Button>
          </div>
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" color="danger" variant="light" onPress={() => onClose()}>
          Cancel
        </Button>
        <Button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm" type="submit" color="primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Crime"}
        </Button>
      </div>
    </form>
  );
}
