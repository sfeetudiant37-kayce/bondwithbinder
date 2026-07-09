import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { photoUrl, bio, price, availability, experience, skills, preferences, objective } = body;

    const updateData: any = {};
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (bio !== undefined) updateData.bio = bio;
    if (price !== undefined) updateData.price = price;
    if (availability !== undefined) updateData.availability = availability;
    if (experience !== undefined) updateData.experience = experience;
    if (skills !== undefined) updateData.skills = JSON.stringify(skills);
    if (preferences !== undefined) updateData.preferences = JSON.stringify(preferences);
    if (objective !== undefined) updateData.objective = objective;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData,
        skills: updateData.skills || '[]',
        preferences: updateData.preferences || '[]',
        objective: updateData.objective || 'find_service',
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
