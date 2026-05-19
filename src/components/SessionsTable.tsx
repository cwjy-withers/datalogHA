"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetailSheet, type SessionDetail } from "@/components/SessionDetailSheet";
import { formatHHMM } from "@/lib/time";

interface Props {
  sessions: SessionDetail[];
}

export function SessionsTable({ sessions }: Props) {
  const [selected, setSelected] = useState<SessionDetail | null>(null);

  return (
    <>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Åldersgrupp</TableHead>
              <TableHead>Användning (H/V)</TableHead>
              <TableHead className="hidden md:table-cell">HNS Grad (H/V)</TableHead>
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
                <TableRow
                  key={session.id}
                  className="cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => setSelected(session)}
                >
                  <TableCell className="font-medium">
                    {format(new Date(session.date), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{session.patient.customId}</TableCell>
                  <TableCell>{session.ageGroup}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>H: {formatHHMM(session.usageTimeRight)}</span>
                      <span>V: {formatHHMM(session.usageTimeLeft)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>H: {session.hnsGradeRight || "-"}</span>
                      <span>V: {session.hnsGradeLeft || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>H: {session.haTypeRight || "-"}</span>
                      <span>V: {session.haTypeLeft || "-"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SessionDetailSheet session={selected} onClose={() => setSelected(null)} />
    </>
  );
}
