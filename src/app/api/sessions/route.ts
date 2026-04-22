import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { appendToExcel } from '@/lib/excel';
import { formSchema } from '@/lib/schemas';
import { format } from 'date-fns';
import { situationsAge0to6, situationsAge7to18 } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = formSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const data = validation.data;

        // 1. Save to SQLite
        // Upsert Patient
        const patient = await db.patient.upsert({
            where: { customId: data.patientId },
            update: {},
            create: { customId: data.patientId },
        });

        // Create Session
        const session = await db.session.create({
            data: {
                date: data.date,
                ageGroup: data.ageGroup,
                birthYear: data.birthYear,
                patientId: patient.id,
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
                haTypeLeft: data.haTypeLeft,
                haTypeRight: data.haTypeRight,
                situationalData: JSON.stringify(data.situationalRatings),
            },
        });

        // 2. Append to Excel
        // Flatten data for Excel
        const excelRow: any = {
            PatientID: data.patientId,
            Datum: format(data.date, 'yyyy-MM-dd'),
            Åldersgrupp: data.ageGroup,
            Födelseår: data.birthYear,

            Time_Right: data.usageTimeRight,
            Est_Time_L: data.estimatedUsageTimeLeft,
            Est_Time_R: data.estimatedUsageTimeRight,
            HNS_Grade_L: data.hnsGradeLeft,
            HNS_Grade_R: data.hnsGradeRight,
            HNS_Type_L: data.hnsTypeLeft,
            HNS_Type_R: data.hnsTypeRight,
            Basnedsattning_L: data.basnedsattningLeft ? "Ja" : "Nej",
            Basnedsattning_R: data.basnedsattningRight ? "Ja" : "Nej",
            Diskantnedsattning_L: data.diskantnedsattningLeft ? "Ja" : "Nej",
            Diskantnedsattning_R: data.diskantnedsattningRight ? "Ja" : "Nej",
            FlatLoss_L: data.flatLossLeft ? "Ja" : "Nej",
            FlatLoss_R: data.flatLossRight ? "Ja" : "Nej",
            HA_Type_L: data.haTypeLeft,
            HA_Type_R: data.haTypeRight,
        };

        // Add explicit situational columns based on age group
        const situations = data.ageGroup === "0-6" ? situationsAge0to6 : situationsAge7to18;
        situations.forEach((situation) => {
            excelRow[`Sit_${situation}`] = data.situationalRatings[situation] || "";
        });

        try {
            await appendToExcel(excelRow);
        } catch (excelError) {
            console.error("Excel export failed:", excelError);
            // We log but don't fail the request, just warn
        }

        return NextResponse.json({ success: true, sessionId: session.id });

    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
