import { NextResponse } from 'next/server';
import db from '@/app/db/dbClient';
import { leads } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { NewLead } from '@/app/db/schema';

// Fetch a specific lead by ID (GET)
export async function GET(request: Request) {
  try {
    const id = new URL(request.url).pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Fetch the lead from the database
    const lead = await db.select().from(leads).where(eq(leads.id, parseInt(id))).limit(1);

    if (lead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead: lead[0] });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// Update a specific lead by ID (PUT)
export async function PUT(request: Request) {
  try {
    const id = new URL(request.url).pathname.split('/').pop();
    const data: Partial<NewLead> = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Update the lead in the database
    const result = await db.update(leads).set(data).where(eq(leads.id, parseInt(id)));

    // Check if any rows were updated
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// Delete a specific lead by ID (DELETE)
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Delete the lead from the database
    const result = await db.delete(leads).where(eq(leads.id, parseInt(id)));

    // Check if any rows were deleted
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
