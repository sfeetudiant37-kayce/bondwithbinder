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
    const { targetUserId, targetRequestId } = body;

    // Get current user with weights
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true, weights: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const weights = currentUser.weights || getDefaultWeights();
    const userPreferences = currentUser.profile?.preferences
      ? JSON.parse(currentUser.profile.preferences)
      : [];
    const userLocation = currentUser.location;

    let result;

    if (targetUserId) {
      // Calculate fit score against a provider
      const target = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { profile: true },
      });

      if (!target || !target.profile) {
        return NextResponse.json(
          { error: 'Target user not found' },
          { status: 404 }
        );
      }

      const targetSkills = JSON.parse(target.profile.skills || '[]');

      result = calculateFitScore(
        userPreferences,
        targetSkills,
        userLocation,
        target.location,
        currentUser.profile?.price || 0,
        target.profile.price || 0,
        target.profile.rating,
        target.profile.availability,
        target.profileCompletion,
        target.profile.experience,
        weights
      );
    } else if (targetRequestId) {
      // Calculate fit score against a request
      const targetRequest = await prisma.serviceRequest.findUnique({
        where: { id: targetRequestId },
        include: {
          client: {
            include: { profile: true },
          },
        },
      });

      if (!targetRequest) {
        return NextResponse.json(
          { error: 'Request not found' },
          { status: 404 }
        );
      }

      const requestSkills = JSON.parse(targetRequest.skills || '[]');

      result = calculateFitScore(
        userPreferences,
        requestSkills,
        userLocation,
        targetRequest.location,
        0,
        targetRequest.budget,
        4.5, // Default mid-rating for requests
        targetRequest.urgency === 'urgent'
          ? 'immediate'
          : targetRequest.urgency === 'this_week'
            ? 'this_week'
            : 'flexible',
        100,
        5, // Default experience
        weights
      );
    } else {
      return NextResponse.json(
        { error: 'Either targetUserId or targetRequestId required' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('FitScore error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate FitScore' },
      { status: 500 }
    );
  }
}
