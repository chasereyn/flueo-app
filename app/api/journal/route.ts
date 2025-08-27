import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { journalEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

// GET /api/journal - Get all journal entries for the current user
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entries = await db.query.journalEntries.findMany({
      where: eq(journalEntries.userId, session.user.id),
      orderBy: (entries, { desc }) => [desc(entries.createdAt)],
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}

// POST /api/journal - Create a new journal entry
export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { englishText } = json;

    if (!englishText?.trim()) {
      return NextResponse.json(
        { error: 'English text is required' },
        { status: 400 }
      );
    }

    const entry = await db.insert(journalEntries).values({
      userId: session.user.id,
      englishText: englishText.trim(),
      aiTranslated: false,
    }).returning();

    return NextResponse.json(entry[0]);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

// PATCH /api/journal - Update a journal entry
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { id, englishText, spanishText } = json;

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.query.journalEntries.findFirst({
      where: eq(journalEntries.id, id),
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Entry not found or unauthorized' },
        { status: 404 }
      );
    }

    const entry = await db
      .update(journalEntries)
      .set({
        englishText: englishText?.trim() ?? existing.englishText,
        spanishText: spanishText?.trim() ?? existing.spanishText,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, id))
      .returning();

    return NextResponse.json(entry[0]);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/journal - Delete a journal entry
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.query.journalEntries.findFirst({
      where: eq(journalEntries.id, parseInt(id)),
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Entry not found or unauthorized' },
        { status: 404 }
      );
    }

    await db
      .delete(journalEntries)
      .where(eq(journalEntries.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    );
  }
}
