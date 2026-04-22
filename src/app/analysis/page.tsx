import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import db from "@/lib/db";
import { situationsAge0to6, situationsAge7to18, frequencyOptions } from "@/lib/schemas";
import { AnalysisPageClient } from "@/components/analysis/AnalysisPageClient";

export const dynamic = "force-dynamic";

async function getRawSessions() {
  try {
    const sessions = await db.session.findMany({
      include: { patient: true },
      orderBy: { createdAt: "desc" },
    });
    // Serialize dates for client component
    return sessions.map((s) => ({
      ...s,
      date: s.date.toISOString(),
      createdAt: s.createdAt.toISOString(),
      patient: { customId: s.patient.customId },
    }));
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
}

export default async function AnalysisPage() {
  const sessions = await getRawSessions();

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">DA</span>
              </div>
              <span className="font-bold text-lg tracking-tight">
                Datalogging Assistant
              </span>
            </div>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="container px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Resultatanalys</h1>
          <p className="text-muted-foreground">
            Aggregerad statistik från alla registrerade sessioner.
          </p>
        </div>

        <AnalysisPageClient
          sessions={sessions}
          situationsAge0to6={situationsAge0to6}
          situationsAge7to18={situationsAge7to18}
          frequencyOptions={frequencyOptions}
        />
      </main>
    </div>
  );
}
