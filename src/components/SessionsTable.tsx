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
                    {formatHHMM(session.usageTimeLeft)} / {formatHHMM(session.usageTimeRight)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>V: {session.hnsGradeLeft || "-"}</span>
                      <span>H: {session.hnsGradeRight || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>V: {session.haTypeLeft || "-"}</span>
                      <span>H: {session.haTypeRight || "-"}</span>
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
