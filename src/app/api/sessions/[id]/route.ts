import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { formSchema } from '@/lib/schemas';
import { format } from 'date-fns';
import { situationsAge0to6, situationsAge7to18 } from '@/lib/schemas';
import { appendToExcel } from '@/lib/excel';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await db.session.findUnique({
            where: { id },
            include: { patient: true },
        });
        if (!session) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = formSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const data = validation.data;

        // Verify session exists
        const existing = await db.session.findUnique({ where: { id }, include: { patient: true } });
        if (!existing) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Update the session record
        const session = await db.session.update({
            where: { id },
            data: {
                date: data.date,
                ageGroup: data.ageGroup,
                birthYear: data.birthYear,
                usageTimeLeft: data.usageTimeLeft,
                usageTimeRight: data.usageTimeRight,
                estimatedUsageTimeLeft: data.estimatedUsageTimeLeft,
                estimatedUsageTimeRight: data.estimatedUsageTimeRight,
                hnsGradeLeft: data.hnsGradeLeft,
                hnsGradeRight: data.hnsGradeRight,
                hnsTypeLeft: data.hnsTypeLeft,
                hnsTypeRight: data.hnsTypeRight,
                basnedsattningLeft: data.basnedsattningLeft,
                basnedsattningRight: data.basnedsattningRight,
                diskantnedsattningLeft: data.diskantnedsattningLeft,
                diskantnedsattningRight: data.diskantnedsattningRight,
                flatLossLeft: data.flatLossLeft,
                flatLossRight: data.flatLossRight,
                symmetricalHearingLoss: data.symmetricalHearingLoss,
                haTypeLeft: data.haTypeLeft,
                haTypeRight: data.haTypeRight,
                situationalData: JSON.stringify(data.situationalRatings),
            },
        });

        return NextResponse.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
