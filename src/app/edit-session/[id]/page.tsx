import { notFound } from "next/navigation";
import db from "@/lib/db";
import { EditSessionForm, splitTime } from "./EditSessionForm";
import type { FormValues } from "@/lib/schemas";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditSessionPage({ params }: Props) {
    const { id } = await params;

    const session = await db.session.findUnique({
        where: { id },
        include: { patient: true },
    });

    if (!session) notFound();

    // Parse situational ratings from JSON
    let situationalRatings: Record<string, string> = {};
    try {
        situationalRatings = JSON.parse(session.situationalData || "{}");
    } catch {
        // leave empty
    }

    // Split decimal usage times back into hours + minutes
    const usageLeft = splitTime(session.usageTimeLeft);
    const usageRight = splitTime(session.usageTimeRight);
    const estLeft = splitTime(session.estimatedUsageTimeLeft);
    const estRight = splitTime(session.estimatedUsageTimeRight);

    const defaultValues: FormValues = {
        // Step 1
        patientId: session.patient.customId,
        date: session.date,
        ageGroup: session.ageGroup as "0-6" | "7-18",
        birthYear: session.birthYear ?? "",

        // Step 2
        situationalRatings,

        // Step 3 — combined decimal values (used for submission)
        usageTimeLeft: session.usageTimeLeft ?? "",
        usageTimeRight: session.usageTimeRight ?? "",
        estimatedUsageTimeLeft: session.estimatedUsageTimeLeft ?? "",
        estimatedUsageTimeRight: session.estimatedUsageTimeRight ?? "",

        // Step 3 — UI split hour/minute inputs
        usageTimeLeftHours: usageLeft.hours,
        usageTimeLeftMinutes: usageLeft.minutes,
        usageTimeRightHours: usageRight.hours,
        usageTimeRightMinutes: usageRight.minutes,
        estimatedUsageTimeLeftHours: estLeft.hours,
        estimatedUsageTimeLeftMinutes: estLeft.minutes,
        estimatedUsageTimeRightHours: estRight.hours,
        estimatedUsageTimeRightMinutes: estRight.minutes,

        // HNS
        hnsGradeLeft: session.hnsGradeLeft ?? "",
        hnsGradeRight: session.hnsGradeRight ?? "",
        hnsTypeLeft: session.hnsTypeLeft ?? "",
        hnsTypeRight: session.hnsTypeRight ?? "",
        symmetricalHearingLoss: session.symmetricalHearingLoss,
        basnedsattningLeft: session.basnedsattningLeft,
        basnedsattningRight: session.basnedsattningRight,
        diskantnedsattningLeft: session.diskantnedsattningLeft,
        diskantnedsattningRight: session.diskantnedsattningRight,
        flatLossLeft: session.flatLossLeft,
        flatLossRight: session.flatLossRight,

        // HA
        haTypeLeft: session.haTypeLeft ?? "",
        haTypeRight: session.haTypeRight ?? "",
    };

    return <EditSessionForm sessionId={id} defaultValues={defaultValues} />;
}
