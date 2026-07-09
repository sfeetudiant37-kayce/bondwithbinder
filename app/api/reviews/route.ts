import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { reviewSchema } from '@/lib/utils/validators';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matchId, revieweeId, rating, comment } = reviewSchema.parse(body);

    // Verify match exists and user is part of it
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    if (match.clientId !== session.user.id && match.providerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        matchId,
        reviewerId: session.user.id,
        revieweeId,
        rating,
        comment,
      },
    });

    // Update provider's rating if reviewee is a provider
    const reviews = await prisma.review.findMany({
      where: { revieweeId },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.profile.update({
      where: { userId: revieweeId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
