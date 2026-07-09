import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateFitScore, getDefaultWeights } from '@/lib/algorithms/fitscore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId, targetRequestId, direction, swiperRole, fitScore } = body;

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findFirst({
      where: {
        swiperId: session.user.id,
        OR: [{ targetUserId }, { targetRequestId }],
      },
    });

    if (existingSwipe) {
      return NextResponse.json({ error: 'Already swiped' }, { status: 400 });
    }

    // Create the swipe
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: session.user.id,
        targetUserId,
        targetRequestId,
        direction,
        swiperRole,
        fitScore: fitScore || 0,
      },
    });

    // If right swipe and provider role, create a match
    if (direction === 'right') {
      let clientId: string;
      let providerId: string;
      let requestId: string | null = null;

      if (swiperRole === 'provider' && targetRequestId) {
        // Provider swiped right on a request
        const req = await prisma.serviceRequest.findUnique({
          where: { id: targetRequestId },
        });
        if (req) {
          clientId = req.clientId;
          providerId = session.user.id;
          requestId = targetRequestId;

          await prisma.match.create({
            data: {
              clientId,
              providerId,
              requestId,
              initiatedBy: 'provider',
              clientFitScore: fitScore || 0,
              status: 'provider_interested',
            },
          });

          // Create notification for client
          await prisma.notification.create({
            data: {
              userId: clientId,
              type: 'provider_interest',
              title: 'Provider Interested',
              body: `A provider (${fitScore}% FitScore) showed interest in your request`,
              referenceId: targetRequestId,
            },
          });
        }
      } else if (swiperRole === 'client' && targetUserId) {
        // Client swiped right on a provider
        clientId = session.user.id;
        providerId = targetUserId;

        // Check if provider already swiped on any of client's requests
        const existingMatch = await prisma.match.findFirst({
          where: {
            clientId,
            providerId,
          },
        });

        if (existingMatch) {
          // Update match to mutual
          await prisma.match.update({
            where: { id: existingMatch.id },
            data: {
              status: 'mutual',
              providerFitScore: fitScore || 0,
            },
          });
        } else {
          await prisma.match.create({
            data: {
              clientId,
              providerId,
              initiatedBy: 'client',
              clientFitScore: fitScore || 0,
              status: 'client_interested',
            },
          });
        }

        // Create notification for provider
        await prisma.notification.create({
          data: {
            userId: providerId,
            type: 'new_match',
            title: 'New Client Interest',
            body: 'A client is interested in your services',
            referenceId: session.user.id,
          },
        });
      }
    }

    return NextResponse.json(swipe);
  } catch (error) {
    console.error('Swipe error:', error);
    return NextResponse.json(
      { error: 'Failed to process swipe' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const role = url.searchParams.get('role') || 'client';

    const swipes = await prisma.swipe.findMany({
      where: {
        swiperId: session.user.id,
        swiperRole: role,
      },
      include: {
        targetRequest: {
          include: {
            client: {
              include: { profile: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(swipes);
  } catch (error) {
    console.error('Get swipes error:', error);
    return NextResponse.json(
      { error: 'Failed to get swipes' },
      { status: 500 }
    );
  }
}
