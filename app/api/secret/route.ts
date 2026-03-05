import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { encryptedText } = await request.json();

  const { data, error } = await supabase
    .from('secrets')
    .insert([{ encrypted_text: encryptedText }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // 1. Fetch the secret
  const { data, error: fetchError } = await supabase
    .from('secrets')
    .select('encrypted_text')
    .eq('id', id)
    .single();

  if (fetchError || !data) {
    return NextResponse.json({ error: 'Secret not found or already burned.' }, { status: 404 });
  }

  // 2. BURN IT (Delete immediately)
  await supabase.from('secrets').delete().eq('id', id);

  // 3. Return encrypted text
  return NextResponse.json({ encryptedText: data.encrypted_text });
}
