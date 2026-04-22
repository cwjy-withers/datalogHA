"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalysisChartsProps {
  ageGroupCounts: Record<string, number>;
  hnsGradeCounts: Record<string, number>;
  haTypeCounts: Record<string, number>;
  hearingLossTypes: {
    basnedsattningLeft: number;
    basnedsattningRight: number;
    diskantnedsattningLeft: number;
    diskantnedsattningRight: number;
    flatLossLeft: number;
    flatLossRight: number;
  };
  situationalAgg0to6: Record<string, Record<string, number>>;
  situationalAgg7to18: Record<string, Record<string, number>>;
  sessions0to6Count: number;
  sessions7to18Count: number;
  frequencyOptions: string[];
}

// ── Horizontal bar chart ──────────────────────────────────────────────────────

function BarChart({
  data,
  maxValue,
  color = "hsl(220 70% 40%)",
}: {
  data: { label: string; value: number }[];
  maxValue: number;
  color?: string;
}) {
  if (data.length === 0 || maxValue === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Ingen data tillgänglig
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {data.map(({ label, value }) => {
        const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="truncate max-w-[70%]">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Situational percentage table ──────────────────────────────────────────────

// 5 clearly distinguishable colour families: red / orange / yellow / green / grey
const FREQ_PALETTE: Record<string, { bg: string; text: string; bar: string }> = {
  Aldrig:   { bg: "hsl(0   80% 94%)", text: "hsl(0   70% 35%)", bar: "hsl(0   70% 55%)" },
  Sällan:   { bg: "hsl(30  85% 93%)", text: "hsl(30  70% 35%)", bar: "hsl(30  75% 55%)" },
  Ibland:   { bg: "hsl(50  85% 92%)", text: "hsl(50  65% 30%)", bar: "hsl(50  75% 50%)" },
  Alltid:   { bg: "hsl(140 70% 92%)", text: "hsl(140 60% 28%)", bar: "hsl(140 60% 45%)" },
  "Vet ej": { bg: "hsl(220 30% 93%)", text: "hsl(220 20% 40%)", bar: "hsl(220 20% 60%)" },
};

function SituationalTable({
  agg,
  frequencyOptions,
}: {
  agg: Record<string, Record<string, number>>;
  frequencyOptions: string[];
}) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full min-w-[600px] text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b w-48">
              Situation
            </th>
            {frequencyOptions.map((freq) => {
              const c = FREQ_PALETTE[freq] ?? { bg: "#eee", text: "#444", bar: "#999" };
              return (
                <th
                  key={freq}
                  className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider border-b"
                  style={{ color: c.text }}
                >
                  {freq}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(agg).map(([sit, counts], rowIdx) => {
            // Per-situation total so percentages always sum to 100 %
            const sitTotal = frequencyOptions.reduce(
              (sum, f) => sum + (counts[f] || 0),
              0
            );
            return (
              <tr
                key={sit}
                className={rowIdx % 2 === 0 ? "bg-muted/20" : "bg-background"}
              >
                <td className="py-3 px-3 font-medium text-xs leading-snug align-middle border-b border-muted/40">
                  {sit}
                </td>
                {frequencyOptions.map((freq) => {
                  const count = counts[freq] || 0;
                  const pct = sitTotal > 0 ? (count / sitTotal) * 100 : 0;
                  const c = FREQ_PALETTE[freq] ?? { bg: "#eee", text: "#444", bar: "#999" };
                  return (
                    <td
                      key={freq}
                      className="py-3 px-3 text-center align-middle border-b border-muted/40"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Coloured percentage badge */}
                        <span
                          className="text-sm font-bold tabular-nums leading-none px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: pct > 0 ? c.bg : "transparent",
                            color: pct > 0 ? c.text : "hsl(0 0% 70%)",
                          }}
                        >
                          {pct > 0 ? `${Math.round(pct)}%` : "—"}
                        </span>
                        {/* Mini proportional bar */}
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct > 0 ? c.bar : "transparent",
                            }}
                          />
                        </div>
                        {/* Raw count */}
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {count > 0 ? `(${count})` : ""}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────

export function AnalysisCharts({
  ageGroupCounts,
  hnsGradeCounts,
  haTypeCounts,
  hearingLossTypes,
  situationalAgg0to6,
  situationalAgg7to18,
  sessions0to6Count,
  sessions7to18Count,
  frequencyOptions,
}: AnalysisChartsProps) {
  const [sitTab, setSitTab] = useState<"all" | "0-6" | "7-18">("all");

  // Merge both age-group aggs for the "Alla" tab
  const allAgg = useMemo(() => {
    const merged: Record<string, Record<string, number>> = {};
    Object.entries(situationalAgg0to6).forEach(([sit, counts]) => {
      merged[sit] = { ...counts };
    });
    Object.entries(situationalAgg7to18).forEach(([sit, counts]) => {
      if (merged[sit]) {
        Object.entries(counts).forEach(([freq, count]) => {
          merged[sit][freq] = (merged[sit][freq] || 0) + count;
        });
      } else {
        merged[sit] = { ...counts };
      }
    });
    return merged;
  }, [situationalAgg0to6, situationalAgg7to18]);

  const ageData = Object.entries(ageGroupCounts).map(([k, v]) => ({ label: `${k} år`, value: v }));
  const maxAge  = Math.max(...ageData.map((d) => d.value), 1);

  const HNS_ORDER = [
    "Normal (<20)",
    "Mycket lätt (21-25 dB)",
    "Lätt (26-40 dB)",
    "Måttlig (41-60 dB)",
    "Svår (61-70 dB)",
    "Grav (71-80 dB)",
  ];
  const hnsData = Object.entries(hnsGradeCounts)
    .sort(([a], [b]) => {
      const ai = HNS_ORDER.indexOf(a);
      const bi = HNS_ORDER.indexOf(b);
      // Unknown grades fall to the end
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })
    .map(([k, v]) => ({ label: k, value: v }));
  const maxHns = Math.max(...hnsData.map((d) => d.value), 1);

  const haData = Object.entries(haTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ label: k, value: v }));
  const maxHa = Math.max(...haData.map((d) => d.value), 1);

  const hlData = [
    { label: "Basnedsättning V",     value: hearingLossTypes.basnedsattningLeft },
    { label: "Basnedsättning H",     value: hearingLossTypes.basnedsattningRight },
    { label: "Diskantnedsättning V", value: hearingLossTypes.diskantnedsattningLeft },
    { label: "Diskantnedsättning H", value: hearingLossTypes.diskantnedsattningRight },
    { label: "Flat Loss V",          value: hearingLossTypes.flatLossLeft },
    { label: "Flat Loss H",          value: hearingLossTypes.flatLossRight },
  ];
  const maxHl = Math.max(...hlData.map((d) => d.value), 1);

  const currentSitAgg =
    sitTab === "all" ? allAgg :
    sitTab === "0-6" ? situationalAgg0to6 : situationalAgg7to18;
  const currentTotal =
    sitTab === "all" ? sessions0to6Count + sessions7to18Count :
    sitTab === "0-6" ? sessions0to6Count  : sessions7to18Count;

  return (
    <div className="space-y-6">
      {/* Row 1: Age groups + Hearing loss types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Åldersgrupper</CardTitle>
            <CardDescription>Fördelning per åldersgrupp</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={ageData} maxValue={maxAge} color="hsl(220 70% 40%)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typ av hörselnedsättning</CardTitle>
            <CardDescription>Antal sessioner per typ och sida</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={hlData} maxValue={maxHl} color="hsl(240 60% 50%)" />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: HNS Grade + HA Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">HNS Grad</CardTitle>
            <CardDescription>Kombinerat vänster + höger</CardDescription>
          </CardHeader>
          <CardContent>
            {hnsData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Ingen data tillgänglig</p>
            ) : (
              <BarChart data={hnsData} maxValue={maxHns} color="hsl(200 70% 45%)" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hörapparattyp</CardTitle>
            <CardDescription>Kombinerat vänster + höger</CardDescription>
          </CardHeader>
          <CardContent>
            {haData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Ingen data tillgänglig</p>
            ) : (
              <BarChart data={haData} maxValue={maxHa} color="hsl(180 60% 40%)" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Situational ratings — percentage table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Situationsbedömning</CardTitle>
              <CardDescription>
                Procentuell fördelning av svar per situation
              </CardDescription>
            </div>
            <div className="flex rounded-md overflow-hidden border text-sm self-start sm:self-center">
              <button
                onClick={() => setSitTab("all")}
                className={`px-4 py-1.5 font-medium transition-colors ${
                  sitTab === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                Alla ({sessions0to6Count + sessions7to18Count})
              </button>
              <button
                onClick={() => setSitTab("0-6")}
                className={`px-4 py-1.5 font-medium transition-colors ${
                  sitTab === "0-6" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                0–6 år ({sessions0to6Count})
              </button>
              <button
                onClick={() => setSitTab("7-18")}
                className={`px-4 py-1.5 font-medium transition-colors ${
                  sitTab === "7-18" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                7–18 år ({sessions7to18Count})
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentTotal === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Inga sessioner i denna åldersgrupp
            </p>
          ) : (
            <SituationalTable agg={currentSitAgg} frequencyOptions={frequencyOptions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
