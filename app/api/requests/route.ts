import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requestSchema } from '@/lib/utils/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const myRequests = url.searchParams.get('my') === 'true';

    const where: any = {};
    if (myRequests) {
      where.clientId = session.user.id;
    } else {
      where.status = 'open';
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        client: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { error: 'Failed to get requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, location, budget, urgency, skills } =
      requestSchema.parse(body);

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        clientId: session.user.id,
        title,
        description,
        category,
        location,
        budget,
        urgency,
        skills: JSON.stringify(skills),
      },
    });

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
