import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const providers = await prisma.user.findMany({
      where: {
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
  } catch (error) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    );
  }
}
