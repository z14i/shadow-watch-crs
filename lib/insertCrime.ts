// lib/insertCrime.ts
import { createClient } from "./supabaseClient";

export interface InsertCrimePayload {
  report_details: string;
  crime_type: string;
  civil_id: string;
  latitude: number | string;
  longitude: number | string;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hour}-${minute}`;
}

export async function insertCrime(payload: InsertCrimePayload) {
  const { report_details, crime_type, civil_id, latitude, longitude } = payload;
  const report_date_time = formatDate(new Date());
  const supabaseClient = createClient();

  const { data, error } = await supabaseClient
    .from("crimes")
    .insert([
      {
        report_details,
        crime_type,
        civil_id,
        latitude: Number(latitude),
        longitude: Number(longitude),
        report_status: "Pending",
        report_date_time,
      },
    ])
    .single();

  return { data, error };
}
