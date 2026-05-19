"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Save, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formSchema, type FormValues } from "@/lib/schemas";
import { Step1PatientInfo } from "@/components/form/Step1PatientInfo";
import { Step2Situation } from "@/components/form/Step2Situation";
import { Step3ClinicalData } from "@/components/form/Step3ClinicalData";
import { ModeToggle } from "@/components/mode-toggle";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const steps = [
    { id: 1, title: "Patientidentifikation", description: "Grundläggande uppgifter om patienten" },
    { id: 2, title: "Situationsbedömning", description: "Bedömning av hörapparatsanvändning i olika situationer" },
    { id: 3, title: "Kliniska Data", description: "Teknisk datalogging och hörselstatus" },
];

// Converts decimal hour string (e.g. "1.50") → { hours: "1", minutes: "30" }
function splitTime(val: string | null | undefined): { hours: string; minutes: string } {
    if (!val || val === "") return { hours: "", minutes: "" };
    const n = parseFloat(val);
    if (isNaN(n)) return { hours: "", minutes: "" };
    const h = Math.floor(n);
    const m = Math.round((n - h) * 60);
    return { hours: h > 0 ? String(h) : "", minutes: m > 0 ? String(m) : "" };
}

interface Props {
    sessionId: string;
    defaultValues: FormValues;
}

export function EditSessionForm({ sessionId, defaultValues }: Props) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [pendingSubmitData, setPendingSubmitData] = useState<FormValues | null>(null);

    const form = useForm<FormValues>({
        // @ts-expect-error Resolver type mismatch due to optional fields
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: "onChange",
    });

    const { trigger, handleSubmit } = form;

    const nextStep = async () => {
        let isValid = false;
        if (currentStep === 1) {
            isValid = await trigger(["patientId", "date", "ageGroup", "birthYear"]);
        } else {
            isValid = true;
        }
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const isFieldEmpty = (val: any) =>
        val === undefined || val === null || val === "" || val === "---";

    const handlePreSubmit = async (data: FormValues) => {
        const isValid = await trigger();
        if (!isValid) return;

        const allSituations =
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            data.ageGroup === "0-6"
                ? require("@/lib/schemas").situationsAge0to6
                : require("@/lib/schemas").situationsAge7to18;

        let hasEmptyFields = false;
        for (const sit of allSituations) {
            if (isFieldEmpty(data.situationalRatings[sit])) {
                hasEmptyFields = true;
                break;
            }
        }

        const hasTime = (h: string | undefined, m: string | undefined) =>
            (parseFloat(h || "0") || 0) > 0 || (parseFloat(m || "0") || 0) > 0;

        const usageTimesFilled = [
            hasTime(data.usageTimeLeftHours, data.usageTimeLeftMinutes),
            hasTime(data.usageTimeRightHours, data.usageTimeRightMinutes),
            hasTime(data.estimatedUsageTimeLeftHours, data.estimatedUsageTimeLeftMinutes),
            hasTime(data.estimatedUsageTimeRightHours, data.estimatedUsageTimeRightMinutes),
        ];

        const otherClinicalFields = [
            data.hnsGradeLeft, data.hnsGradeRight,
            data.hnsTypeLeft, data.hnsTypeRight,
            data.haTypeLeft, data.haTypeRight,
        ];

        if (
            !hasEmptyFields &&
            (usageTimesFilled.some((f) => !f) || otherClinicalFields.some(isFieldEmpty))
        ) {
            hasEmptyFields = true;
        }

        if (hasEmptyFields) {
            setPendingSubmitData(data);
            setShowWarning(true);
        } else {
            onSubmit(data);
        }
    };

    const combineTime = (hours: string, minutes: string): string => {
        const h = parseFloat(hours) || 0;
        const m = parseFloat(minutes) || 0;
        if (h === 0 && m === 0) return "";
        return (h + m / 60).toFixed(2);
    };

    const onSubmit = async (data: FormValues) => {
        setShowWarning(false);
        setIsSubmitting(true);

        const payload = {
            ...data,
            usageTimeLeft: combineTime(data.usageTimeLeftHours ?? "", data.usageTimeLeftMinutes ?? ""),
            usageTimeRight: combineTime(data.usageTimeRightHours ?? "", data.usageTimeRightMinutes ?? ""),
            estimatedUsageTimeLeft: combineTime(data.estimatedUsageTimeLeftHours ?? "", data.estimatedUsageTimeLeftMinutes ?? ""),
            estimatedUsageTimeRight: combineTime(data.estimatedUsageTimeRightHours ?? "", data.estimatedUsageTimeRightMinutes ?? ""),
        };

        try {
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update session");

            setHasSubmitted(true);
        } catch (error) {
            console.error("Error updating session:", error);
            alert("Ett fel inträffade när sessionen skulle uppdateras.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasSubmitted) {
        return (
            <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex items-center justify-center">
                <Card className="max-w-md w-full text-center p-6 space-y-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Save className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Session Uppdaterad!</CardTitle>
                    <CardDescription>
                        Ändringarna har sparats till databasen.
                    </CardDescription>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button onClick={() => router.push("/")}>
                            Gå till startsidan
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Pencil className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">Redigera session</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Steg {currentStep} av {steps.length}: {steps[currentStep - 1].title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="outline" onClick={() => router.back()}>
                            Avbryt
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>

                {/* Form Content */}
                <Card className="border-t-4 border-t-primary shadow-md">
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormProvider {...form}>
                            <form onSubmit={handleSubmit(handlePreSubmit as any)} className="space-y-8">
                                {currentStep === 1 && <Step1PatientInfo />}
                                {currentStep === 2 && <Step2Situation />}
                                {currentStep === 3 && <Step3ClinicalData />}
                            </form>
                        </FormProvider>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
                        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Tillbaka
                        </Button>
                        {currentStep < steps.length ? (
                            <Button onClick={nextStep}>
                                Nästa
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit(handlePreSubmit as any)}
                                disabled={isSubmitting}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isSubmitting ? "Sparar..." : "Spara ändringar"}
                                {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Warning Modal */}
                <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Varning: Ofullständiga uppgifter</AlertDialogTitle>
                            <AlertDialogDescription>
                                Vissa fält har inte fyllts i. Är du säker på att du vill spara ändå?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowWarning(false)}>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (pendingSubmitData) onSubmit(pendingSubmitData);
                                }}
                            >
                                Fortsätt ändå
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}

export { splitTime };
