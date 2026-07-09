import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const role = url.searchParams.get('role') || 'client';

    // Get user's swipes to exclude
    const swipes = await prisma.swipe.findMany({
      where: {
        swiperId: session.user.id,
        swiperRole: role,
      },
      select: {
        targetUserId: true,
        targetRequestId: true,
      },
    });

    const swipedUserIds = swipes
      .filter((s) => s.targetUserId)
      .map((s) => s.targetUserId as string);
    const swipedRequestIds = swipes
      .filter((s) => s.targetRequestId)
      .map((s) => s.targetRequestId as string);

    if (role === 'provider') {
      // Fetch open requests that haven't been swiped on
      const requests = await prisma.serviceRequest.findMany({
        where: {
          status: 'open',
          id: { notIn: swipedRequestIds },
          clientId: { not: session.user.id },
        },
        include: {
          client: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(requests);
    } else {
      // Fetch providers that haven't been swiped on and are not the current user
      const providers = await prisma.user.findMany({
        where: {
          id: { notIn: [...swipedUserIds, session.user.id] },
          profile: {
            objective: { in: ['offer_service', 'both'] },
          },
        },
        include: {
          profile: true,
        },
        take: 20,
      });

      return NextResponse.json({ providers });
    }
  } catch (error) {
    console.error('Get discovery items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
