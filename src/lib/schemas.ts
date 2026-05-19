import { z } from "zod";

export const formSchema = z.object({
    // Step 1: Patient Info
    patientId: z.string().min(1, "Patient ID är obligatoriskt"),
    date: z.coerce.date(),
    ageGroup: z.enum(["0-6", "7-18"]),
    birthYear: z.string().min(4, "Födelseår är obligatoriskt"),

    // Step 2: Situational Data
    // Keys will be situation strings, values are ratings
    situationalRatings: z.record(z.string(), z.string().optional()),

    // Step 3: Clinical Data (combined decimal stored in usageTime* fields)
    usageTimeLeft: z.string().optional(),
    usageTimeRight: z.string().optional(),
    estimatedUsageTimeLeft: z.string().optional(),
    estimatedUsageTimeRight: z.string().optional(),

    // UI-only hour/minute inputs — combined into the fields above before API call
    usageTimeLeftHours: z.string().optional(),
    usageTimeLeftMinutes: z.string().optional(),
    usageTimeRightHours: z.string().optional(),
    usageTimeRightMinutes: z.string().optional(),
    estimatedUsageTimeLeftHours: z.string().optional(),
    estimatedUsageTimeLeftMinutes: z.string().optional(),
    estimatedUsageTimeRightHours: z.string().optional(),
    estimatedUsageTimeRightMinutes: z.string().optional(),

    hnsGradeLeft: z.string().optional(),
    hnsGradeRight: z.string().optional(),
    hnsTypeLeft: z.string().optional(),
    hnsTypeRight: z.string().optional(),

    basnedsattningLeft: z.boolean().default(false),
    basnedsattningRight: z.boolean().default(false),
    diskantnedsattningLeft: z.boolean().default(false),
    diskantnedsattningRight: z.boolean().default(false),
    flatLossLeft: z.boolean().default(false),
    flatLossRight: z.boolean().default(false),

    haTypeLeft: z.string().optional(),
    haTypeRight: z.string().optional(),

    symmetricalHearingLoss: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

export const situationsAge0to6 = [
    "Vid måltid",
    "Egen lek",
    "Lek/aktivitet med föräldrar/kompisar",
    "TV/dator/surfplatta",
    "Vid läggdags",
    "I barnvagnen",
    "I bilen",
    "På förskolan",
    "Utomhus",
    "På offentliga platser",
];

export const situationsAge7to18 = [
    "Vid måltid",
    "Egen aktivitet tex ensam hemma",
    "Lek/aktivitet med föräldrar/kompisar",
    "TV/dator/surfplatta",
    "Vid läggdags",
    "I bilen",
    "I skolan",
    "På offentliga platser",
    "Utomhus",
    "Vid fritidsaktivitet",
];

export const frequencyOptions = ["Aldrig", "Sällan", "Ibland", "Alltid", "Vet ej"];
