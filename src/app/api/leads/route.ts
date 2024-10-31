import { NextResponse } from 'next/server';
import db from '@/app/db/dbClient';
import { leads } from '@/app/db/schema';

// Fetch all leads (GET)
export async function GET() {
  try {
    const allLeads = await db.select().from(leads);
    return NextResponse.json({ allLeads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

