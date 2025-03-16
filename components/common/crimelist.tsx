"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

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

export default function CrimeList() {
  const [crimes, setCrimes] = useState<Crime[]>([]);

  useEffect(() => {
    async function fetchCrimes() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('crimes')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching crimes:', error);
      } else {
        setCrimes(data);
      }
    }
    fetchCrimes();
  }, []);

  return (
    <div>
      <h2>Crime Reports</h2>
      <ul>
        {crimes.map(crime => (
          <li key={crime.id}>
            <strong>{crime.crime_type}:</strong> {crime.report_details} – {crime.report_status}
          </li>
        ))}
      </ul>
    </div>
  );
}
