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
    const requestId = url.searchParams.get('requestId');

    if (requestId) {
      // Get providers interested in a specific request
      const matches = await prisma.match.findMany({
        where: {
          requestId,
          clientId: session.user.id,
          status: { in: ['provider_interested', 'mutual'] },
        },
        include: {
          provider: {
            include: { profile: true },
          },
          request: true,
          conversation: true,
        },
        orderBy: { clientFitScore: 'desc' },
      });

      return NextResponse.json(
        matches.map((m) => ({
          ...m,
          provider: {
            ...m.provider,
            fitScore: m.clientFitScore,
          },
        }))
      );
    }

    // Get all providers interested in any of user's requests
    const userRequests = await prisma.serviceRequest.findMany({
      where: { clientId: session.user.id },
      select: { id: true },
    });

    const requestIds = userRequests.map((r) => r.id);

    const matches = await prisma.match.findMany({
      where: {
        requestId: { in: requestIds },
        clientId: session.user.id,
        status: { in: ['provider_interested', 'mutual'] },
      },
      include: {
        provider: {
          include: { profile: true },
        },
        request: true,
        conversation: true,
      },
      orderBy: { clientFitScore: 'desc' },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Get interested error:', error);
    return NextResponse.json(
      { error: 'Failed to get interested providers' },
      { status: 500 }
    );
  }
}
