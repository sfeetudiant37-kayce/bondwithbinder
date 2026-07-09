import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matchId, providerId, clientId, initialMessage } = body;

    let match;

    if (matchId) {
      match = await prisma.match.findUnique({
        where: { id: matchId },
      });
    } else if (providerId && clientId) {
      // Find existing match or create one
      match = await prisma.match.findFirst({
        where: {
          clientId,
          providerId,
        },
      });

      if (!match) {
        // Create a new match with mutual status if initiating conversation
        match = await prisma.match.create({
          data: {
            clientId,
            providerId,
            initiatedBy: 'client',
            clientFitScore: 0,
            status: 'mutual',
          },
        });
      }
    } else {
      return NextResponse.json(
        { error: 'matchId or both providerId and clientId required' },
        { status: 400 }
      );
    }

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findUnique({
      where: { matchId: match.id },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          matchId: match.id,
        },
      });

      // Update match status to mutual if not already
      if (match.status !== 'mutual') {
        await prisma.match.update({
          where: { id: match.id },
          data: { status: 'mutual' },
        });
      }
    }

    // Send initial message if provided
    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          content: initialMessage,
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
