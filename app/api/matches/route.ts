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
    const role = url.searchParams.get('role') || 'all';

    const where: any = {
      OR: [{ clientId: session.user.id }, { providerId: session.user.id }],
    };

    if (role === 'client') {
      delete where.OR;
      where.clientId = session.user.id;
    } else if (role === 'provider') {
      delete where.OR;
      where.providerId = session.user.id;
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        client: {
          include: { profile: true },
        },
        provider: {
          include: { profile: true },
        },
        request: true,
        conversation: {
          include: {
            messages: {
              orderBy: { sentAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Failed to get matches' },
      { status: 500 }
    );
  }
}
