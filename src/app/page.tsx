import Link from "next/link";
import { format } from "date-fns";
import { PlusCircle, FileText, History, FileSpreadsheet, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";

// Force dynamic rendering to fetch fresh data
export const dynamic = 'force-dynamic';

async function getSessions() {
  try {
    const sessions = await db.session.findMany({
      orderBy: { createdAt: 'desc' },
      include: { patient: true },
    });
    return sessions;
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
}

export default async function Home() {
  const sessions = await getSessions();

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">DA</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Datalogging Assistant</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="container px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 py-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground">
            Hörselrehabilitering
            <span className="block text-primary mt-2">Datalogging & Uppföljning</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px]">
            Ett professionellt verktyg för att dokumentera och analysera användning av hörseltekniska hjälpmedel för barn och ungdomar.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/new-session">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                <PlusCircle className="mr-2 h-5 w-5" />
                Ny Session
              </Button>
            </Link>
            <Link href="/analysis">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analys
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity / Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Tidigare Sessioner</h2>
              <p className="text-muted-foreground">
                Totalt {sessions.length} sparade sessioner.
              </p>
            </div>
            {/* <Button variant="outline">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Ladda ner Master Excel
                        </Button> */}
          </div>

          <div className="rounded-md border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Åldersgrupp</TableHead>
                  <TableHead>Användning (V/H)</TableHead>
                  <TableHead className="hidden md:table-cell">HNS Grad (V/H)</TableHead>
                  <TableHead className="hidden md:table-cell">Hörapparat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Inga sessioner hittades.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {format(session.date, 'yyyy-MM-dd')}
                      </TableCell>
                      <TableCell>{session.patient.customId}</TableCell>
                      <TableCell>{session.ageGroup}</TableCell>
                      <TableCell>
                        {session.usageTimeLeft || '-'} / {session.usageTimeRight || '-'} h
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>V: {session.hnsGradeLeft || '-'}</span>
                          <span>H: {session.hnsGradeRight || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>V: {session.haTypeLeft || '-'}</span>
                          <span>H: {session.haTypeRight || '-'}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
