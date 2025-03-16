// components/CrimeForm.tsx
"use client";

import { useState } from 'react';

export default function CrimeForm() {
  const [formData, setFormData] = useState({
    report_details: '',
    crime_type: '',
    civil_id: '',
    latitude: '',
    longitude: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/crimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response from API:', errorData);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      alert('Crime reported successfully!');
      // Clear form after success
      setFormData({
        report_details: '',
        crime_type: '',
        civil_id: '',
        latitude: '',
        longitude: '',
      });
      // Optionally, trigger a re-fetch of your map data here.
    } catch (error: any) {
      console.error('Failed to submit crime:', error.message);
      alert('Failed to report crime. ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <div>
        <label>Report Details:</label>
        <input
          type="text"
          name="report_details"
          value={formData.report_details}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Crime Type:</label>
        <select
          name="crime_type"
          value={formData.crime_type}
          onChange={handleChange}
          required
        >
          <option value="">Select a crime type</option>
          <option value="Robbery">Robbery</option>
          <option value="Assault">Assault</option>
          <option value="Homicide">Homicide</option>
          <option value="Kidnapping">Kidnapping</option>
          <option value="Theft">Theft</option>
        </select>
      </div>
      <div>
        <label>Civil ID (7 digits):</label>
        <input
          type="text"
          name="civil_id"
          value={formData.civil_id}
          onChange={handleChange}
          required
          pattern="\d{7}"
          title="Please enter exactly 7 digits."
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          name="latitude"
          step="any"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          name="longitude"
          step="any"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Report Crime'}
      </button>
    </form>
  );
}
