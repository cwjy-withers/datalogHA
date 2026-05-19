"use client";

import { useEffect } from "react";
import { X, User, Calendar, Ear, Clock, Activity, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export type SessionDetail = {
  id: string;
  date: string;
  ageGroup: string;
  birthYear: string | null;
  usageTimeLeft: string | null;
  usageTimeRight: string | null;
  estimatedUsageTimeLeft: string | null;
  estimatedUsageTimeRight: string | null;
  hnsGradeLeft: string | null;
  hnsGradeRight: string | null;
  hnsTypeLeft: string | null;
  hnsTypeRight: string | null;
  symmetricalHearingLoss: boolean;
  basnedsattningLeft: boolean;
  basnedsattningRight: boolean;
  diskantnedsattningLeft: boolean;
  diskantnedsattningRight: boolean;
  flatLossLeft: boolean;
  flatLossRight: boolean;
  haTypeLeft: string | null;
  haTypeRight: string | null;
  situationalData: string;
  patient: { customId: string };
};

interface Props {
  session: SessionDetail | null;
  onClose: () => void;
}

function formatTime(val: string | null): string {
  if (!val || val === "") return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  const h = Math.floor(n);
  const m = Math.round((n - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} tim`;
  return `${h} tim ${m} min`;
}

function val(v: string | null | undefined): string {
  if (!v || v === "" || v === "---") return "—";
  return v;
}

function YesNo({ value }: { value: boolean }) {
  return (
    <span className={value ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
      {value ? "Ja" : "Nej"}
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">{title}</h3>
    </div>
  );
}

function EarGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Vänster öra</p>
        {left}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Höger öra</p>
        {right}
      </div>
    </div>
  );
}

export function SessionDetailSheet({ session, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (session) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [session]);

  let situationalRatings: Record<string, string> = {};
  if (session?.situationalData) {
    try {
      situationalRatings = JSON.parse(session.situationalData);
    } catch {
      // ignore
    }
  }
  const situationEntries = Object.entries(situationalRatings).filter(([, v]) => v && v !== "");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          session ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          session ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Sessionsdetaljer"
      >
        {session && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Sessionsdetaljer</p>
                <h2 className="text-lg font-bold">{session.patient.customId}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.date), "d MMMM yyyy")} · {session.ageGroup} år
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 mt-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Stäng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              {/* Patient Info */}
              <section>
                <SectionHeader icon={User} title="Patientinfo" />
                <div className="rounded-lg border bg-card p-4 space-y-0.5">
                  <Row label="Patient ID" value={val(session.patient.customId)} />
                  <Row label="Födelseår" value={val(session.birthYear)} />
                  <Row label="Åldersgrupp" value={`${session.ageGroup} år`} />
                  <Row label="Datum" value={format(new Date(session.date), "yyyy-MM-dd")} />
                </div>
              </section>

              <Separator />

              {/* Datalogging */}
              <section>
                <SectionHeader icon={Clock} title="Datalogging" />
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <EarGrid
                    left={
                      <div className="space-y-1">
                        <Row label="Faktisk" value={formatTime(session.usageTimeLeft)} />
                        <Row label="Uppskattad" value={formatTime(session.estimatedUsageTimeLeft)} />
                      </div>
                    }
                    right={
                      <div className="space-y-1">
                        <Row label="Faktisk" value={formatTime(session.usageTimeRight)} />
                        <Row label="Uppskattad" value={formatTime(session.estimatedUsageTimeRight)} />
                      </div>
                    }
                  />
                </div>
              </section>

              <Separator />

              {/* HNS */}
              <section>
                <SectionHeader icon={Activity} title="Grad av hörselnedsättning (HNS)" />
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <Row label="Liksidig hörselnedsättning" value={<YesNo value={session.symmetricalHearingLoss} />} />
                  <div className="pt-1">
                    <EarGrid
                      left={
                        <div className="space-y-1">
                          <Row label="Grad" value={val(session.hnsGradeLeft)} />
                          <Row label="Typ" value={val(session.hnsTypeLeft)} />
                          <Row label="Basnedsättning" value={<YesNo value={session.basnedsattningLeft} />} />
                          <Row label="Grav diskant" value={<YesNo value={session.diskantnedsattningLeft} />} />
                          <Row label="Flat loss" value={<YesNo value={session.flatLossLeft} />} />
                        </div>
                      }
                      right={
                        <div className="space-y-1">
                          <Row label="Grad" value={val(session.hnsGradeRight)} />
                          <Row label="Typ" value={val(session.hnsTypeRight)} />
                          <Row label="Basnedsättning" value={<YesNo value={session.basnedsattningRight} />} />
                          <Row label="Grav diskant" value={<YesNo value={session.diskantnedsattningRight} />} />
                          <Row label="Flat loss" value={<YesNo value={session.flatLossRight} />} />
                        </div>
                      }
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Hearing Aid */}
              <section>
                <SectionHeader icon={Ear} title="Hörapparat" />
                <div className="rounded-lg border bg-card p-4">
                  <EarGrid
                    left={<Row label="Typ" value={val(session.haTypeLeft)} />}
                    right={<Row label="Typ" value={val(session.haTypeRight)} />}
                  />
                </div>
              </section>

              {/* Situational Assessment */}
              {situationEntries.length > 0 && (
                <>
                  <Separator />
                  <section>
                    <SectionHeader icon={CheckCircle2} title="Situationsbedömning" />
                    <div className="rounded-lg border bg-card p-4 space-y-0.5">
                      {situationEntries.map(([situation, rating]) => (
                        <Row key={situation} label={situation} value={
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rating === "Alltid" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                            rating === "Ibland" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                            rating === "Sällan" ? "bg-orange-500/15 text-orange-600 dark:text-orange-400" :
                            rating === "Aldrig" ? "bg-red-500/15 text-red-600 dark:text-red-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {rating}
                          </span>
                        } />
                      ))}
                    </div>
                  </section>
                </>
              )}

            </div>
          </>
        )}
      </div>
    </>
  );
}
