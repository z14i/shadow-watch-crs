import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';


export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('crimes')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching crimes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data, { status: 200 });
}
