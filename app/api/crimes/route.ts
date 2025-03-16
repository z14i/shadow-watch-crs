// app/api/crimes/route.ts
import { NextResponse } from "next/server";
import { insertCrime } from "@/lib/insertCrime";
import { createClient } from "@/lib/supabaseClient";

export async function GET() {
  const supabaseClient = createClient(); 
  const { data, error } = await supabaseClient
    .from("crimes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching crimes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await insertCrime(body);

    if (error) {
      console.error("Error inserting crime:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json({ error: "Failed to parse request" }, { status: 400 });
  }
}


