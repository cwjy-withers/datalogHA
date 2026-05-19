"use client";

import { useMemo, useState } from "react";
import { BarChart3, Users, Clock, Ear, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisCharts } from "@/components/analysis/AnalysisCharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type RawSession = {
  id: string;
  date: string;
  ageGroup: string;
  birthYear: string | null;
  patientId: string;
  usageTimeLeft: string | null;
  usageTimeRight: string | null;
  estimatedUsageTimeLeft: string | null;
  estimatedUsageTimeRight: string | null;
  hnsGradeLeft: string | null;
  hnsGradeRight: string | null;
  hnsTypeLeft: string | null;
  hnsTypeRight: string | null;
  basnedsattningLeft: boolean;
  basnedsattningRight: boolean;
  diskantnedsattningLeft: boolean;
  diskantnedsattningRight: boolean;
  flatLossLeft: boolean;
  flatLossRight: boolean;
  haTypeLeft: string | null;
  haTypeRight: string | null;
  symmetricalHearingLoss: boolean;
  situationalData: string;
  createdAt: string;
  patient: { customId: string };
};

interface Props {
  sessions: RawSession[];
  situationsAge0to6: string[];
  situationsAge7to18: string[];
  frequencyOptions: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function aggregate(
  sessions: RawSession[],
  situationsAge0to6: string[],
  situationsAge7to18: string[],
  frequencyOptions: string[]
) {
  const totalSessions = sessions.length;
  const uniquePatients = new Set(sessions.map((s) => s.patientId)).size;

  const ageGroupCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    ageGroupCounts[s.ageGroup] = (ageGroupCounts[s.ageGroup] || 0) + 1;
  });

  const usageLeft = sessions
    .map((s) => parseFloat(s.usageTimeLeft || "0"))
    .filter((v) => !isNaN(v) && v > 0);
  const usageRight = sessions
    .map((s) => parseFloat(s.usageTimeRight || "0"))
    .filter((v) => !isNaN(v) && v > 0);

  const avgUsageLeft =
    usageLeft.length > 0
      ? (usageLeft.reduce((a, b) => a + b, 0) / usageLeft.length).toFixed(1)
      : "—";
  const avgUsageRight =
    usageRight.length > 0
      ? (usageRight.reduce((a, b) => a + b, 0) / usageRight.length).toFixed(1)
      : "—";

  const hnsGradeCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.hnsGradeLeft)
      hnsGradeCounts[s.hnsGradeLeft] = (hnsGradeCounts[s.hnsGradeLeft] || 0) + 1;
    if (s.hnsGradeRight)
      hnsGradeCounts[s.hnsGradeRight] = (hnsGradeCounts[s.hnsGradeRight] || 0) + 1;
  });

  const haTypeCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.haTypeLeft && s.haTypeLeft !== "---")
      haTypeCounts[s.haTypeLeft] = (haTypeCounts[s.haTypeLeft] || 0) + 1;
    if (s.haTypeRight && s.haTypeRight !== "---")
      haTypeCounts[s.haTypeRight] = (haTypeCounts[s.haTypeRight] || 0) + 1;
  });

  const hearingLossTypes = {
    basnedsattningLeft: sessions.filter((s) => s.basnedsattningLeft).length,
    basnedsattningRight: sessions.filter((s) => s.basnedsattningRight).length,
    diskantnedsattningLeft: sessions.filter((s) => s.diskantnedsattningLeft).length,
    diskantnedsattningRight: sessions.filter((s) => s.diskantnedsattningRight).length,
    flatLossLeft: sessions.filter((s) => s.flatLossLeft).length,
    flatLossRight: sessions.filter((s) => s.flatLossRight).length,
  };

  const situationalAgg0to6: Record<string, Record<string, number>> = {};
  const situationalAgg7to18: Record<string, Record<string, number>> = {};

  situationsAge0to6.forEach((sit) => {
    situationalAgg0to6[sit] = {};
    frequencyOptions.forEach((opt) => (situationalAgg0to6[sit][opt] = 0));
  });
  situationsAge7to18.forEach((sit) => {
    situationalAgg7to18[sit] = {};
    frequencyOptions.forEach((opt) => (situationalAgg7to18[sit][opt] = 0));
  });

  sessions.forEach((s) => {
    try {
      const ratings: Record<string, string> = JSON.parse(s.situationalData || "{}");
      const agg = s.ageGroup === "0-6" ? situationalAgg0to6 : situationalAgg7to18;
      Object.entries(ratings).forEach(([situation, rating]) => {
        if (agg[situation] && rating) {
          agg[situation][rating] = (agg[situation][rating] || 0) + 1;
        }
      });
    } catch {
      // skip
    }
  });

  return {
    totalSessions,
    uniquePatients,
    avgUsageLeft,
    avgUsageRight,
    ageGroupCounts,
    hnsGradeCounts,
    haTypeCounts,
    hearingLossTypes,
    situationalAgg0to6,
    situationalAgg7to18,
    sessions0to6Count: sessions.filter((s) => s.ageGroup === "0-6").length,
    sessions7to18Count: sessions.filter((s) => s.ageGroup === "7-18").length,
  };
}

// ─── Small helper components ──────────────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-destructive transition-colors"
        aria-label={`Ta bort filter: ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  wrap = true,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  wrap?: boolean;
}) {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]
    );

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className={`flex gap-2 ${wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto pb-1"}`}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AnalysisPageClient({
  sessions,
  situationsAge0to6,
  situationsAge7to18,
  frequencyOptions,
}: Props) {
  // ── Filter state ──
  const [ageGroupFilter, setAgeGroupFilter] = useState<"all" | "0-6" | "7-18">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedHnsGrades, setSelectedHnsGrades] = useState<string[]>([]);
  const [selectedHnsTypes, setSelectedHnsTypes] = useState<string[]>([]);
  const [selectedHaTypes, setSelectedHaTypes] = useState<string[]>([]);
  const [selectedSymmetrical, setSelectedSymmetrical] = useState<string[]>([]);

  // ── Derive unique filter options from all sessions ──
  const allHnsGrades = useMemo(() => {
    const HNS_ORDER = [
      "Normal (<20)",
      "Mycket lätt (21-25 dB)",
      "Lätt (26-40 dB)",
      "Måttlig (41-60 dB)",
      "Svår (61-70 dB)",
      "Grav (71-80 dB)",
    ];
    const grades = new Set<string>();
    sessions.forEach((s) => {
      if (s.hnsGradeLeft) grades.add(s.hnsGradeLeft);
      if (s.hnsGradeRight) grades.add(s.hnsGradeRight);
    });
    return Array.from(grades).sort((a, b) => {
      const ai = HNS_ORDER.indexOf(a);
      const bi = HNS_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }, [sessions]);

  const allHnsTypes = useMemo(() => {
    const types = new Set<string>();
    sessions.forEach((s) => {
      if (s.hnsTypeLeft && s.hnsTypeLeft !== "---") types.add(s.hnsTypeLeft);
      if (s.hnsTypeRight && s.hnsTypeRight !== "---") types.add(s.hnsTypeRight);
    });
    return Array.from(types).sort();
  }, [sessions]);

  const allHaTypes = useMemo(() => {
    const types = new Set<string>();
    sessions.forEach((s) => {
      if (s.haTypeLeft && s.haTypeLeft !== "---") types.add(s.haTypeLeft);
      if (s.haTypeRight && s.haTypeRight !== "---") types.add(s.haTypeRight);
    });
    return Array.from(types).sort();
  }, [sessions]);

  // ── Apply filters ──
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Age group
      if (ageGroupFilter !== "all" && s.ageGroup !== ageGroupFilter) return false;

      // Date from
      if (dateFrom && new Date(s.date) < new Date(dateFrom)) return false;

      // Date to
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(s.date) > to) return false;
      }

      // HNS grade filter — session matches if either ear matches any selected grade
      if (selectedHnsGrades.length > 0) {
        const match =
          selectedHnsGrades.includes(s.hnsGradeLeft ?? "") ||
          selectedHnsGrades.includes(s.hnsGradeRight ?? "");
        if (!match) return false;
      }

      // HNS type filter
      if (selectedHnsTypes.length > 0) {
        const match =
          selectedHnsTypes.includes(s.hnsTypeLeft ?? "") ||
          selectedHnsTypes.includes(s.hnsTypeRight ?? "");
        if (!match) return false;
      }

      // HA type filter
      if (selectedHaTypes.length > 0) {
        const match =
          selectedHaTypes.includes(s.haTypeLeft ?? "") ||
          selectedHaTypes.includes(s.haTypeRight ?? "");
        if (!match) return false;
      }

      // Symmetrical hearing loss filter
      if (selectedSymmetrical.length > 0) {
        const isSymmetrical = s.symmetricalHearingLoss ? "Ja" : "Nej";
        if (!selectedSymmetrical.includes(isSymmetrical)) return false;
      }

      return true;
    });
  }, [sessions, ageGroupFilter, dateFrom, dateTo, selectedHnsGrades, selectedHnsTypes, selectedHaTypes, selectedSymmetrical]);

  // ── Compute aggregated stats from filtered sessions ──
  const data = useMemo(
    () => aggregate(filteredSessions, situationsAge0to6, situationsAge7to18, frequencyOptions),
    [filteredSessions, situationsAge0to6, situationsAge7to18, frequencyOptions]
  );

  // ── Active filter chips ──
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (ageGroupFilter !== "all")
    activeFilters.push({ label: `Ålder: ${ageGroupFilter} år`, clear: () => setAgeGroupFilter("all") });
  if (dateFrom)
    activeFilters.push({ label: `Från: ${dateFrom}`, clear: () => setDateFrom("") });
  if (dateTo)
    activeFilters.push({ label: `Till: ${dateTo}`, clear: () => setDateTo("") });
  selectedHnsGrades.forEach((g) =>
    activeFilters.push({ label: `HNS Grad: ${g}`, clear: () => setSelectedHnsGrades((prev) => prev.filter((v) => v !== g)) })
  );
  selectedHnsTypes.forEach((t) =>
    activeFilters.push({ label: `HNS Typ: ${t}`, clear: () => setSelectedHnsTypes((prev) => prev.filter((v) => v !== t)) })
  );
  selectedHaTypes.forEach((t) =>
    activeFilters.push({ label: `HA: ${t}`, clear: () => setSelectedHaTypes((prev) => prev.filter((v) => v !== t)) })
  );
  selectedSymmetrical.forEach((v) =>
    activeFilters.push({ label: `Liksidig HNS: ${v}`, clear: () => setSelectedSymmetrical((prev) => prev.filter((o) => o !== v)) })
  );

  const clearAll = () => {
    setAgeGroupFilter("all");
    setDateFrom("");
    setDateTo("");
    setSelectedHnsGrades([]);
    setSelectedHnsTypes([]);
    setSelectedHaTypes([]);
    setSelectedSymmetrical([]);
  };

  // ── Stat cards ──
  const statCards = [
    {
      title: "Sessioner",
      value: data.totalSessions,
      total: sessions.length,
      description: "av totalt " + sessions.length,
      icon: BarChart3,
    },
    {
      title: "Unika Patienter",
      value: data.uniquePatients,
      description: "Distinkta patient-ID:n",
      icon: Users,
    },
    {
      title: "Snitt Användning Vänster",
      value: data.avgUsageLeft === "—" ? "—" : `${data.avgUsageLeft} h`,
      description: "Genomsnittlig daglig användning",
      icon: Clock,
    },
    {
      title: "Snitt Användning Höger",
      value: data.avgUsageRight === "—" ? "—" : `${data.avgUsageRight} h`,
      description: "Genomsnittlig daglig användning",
      icon: Ear,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Filter panel ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Filter</CardTitle>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAll}
                className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Rensa alla
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Row 1: Age group + Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Age group */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Åldersgrupp
              </p>
              <div className="flex rounded-md overflow-hidden border text-sm">
                {(["all", "0-6", "7-18"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAgeGroupFilter(v)}
                    className={`flex-1 py-1.5 font-medium transition-colors ${
                      ageGroupFilter === v
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {v === "all" ? "Alla" : `${v} år`}
                  </button>
                ))}
              </div>
            </div>

            {/* Date from */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Datum från
              </p>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Date to */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Datum till
              </p>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Row 2: HNS — full width, no wrap */}
          {allHnsGrades.length > 0 && (
            <CheckboxGroup
              label="HNS Grad"
              options={allHnsGrades}
              selected={selectedHnsGrades}
              onChange={setSelectedHnsGrades}
              wrap={false}
            />
          )}

          {/* Row 3: HNS Type */}
          {allHnsTypes.length > 0 && (
            <CheckboxGroup
              label="Typ av hörselnedsättning"
              options={allHnsTypes}
              selected={selectedHnsTypes}
              onChange={setSelectedHnsTypes}
            />
          )}

          {/* Row 4: HA type */}
          {allHaTypes.length > 0 && (
            <CheckboxGroup
              label="Hörapparattyp"
              options={allHaTypes}
              selected={selectedHaTypes}
              onChange={setSelectedHaTypes}
            />
          )}

          {/* Row 5: Symmetrical HNS */}
          <CheckboxGroup
            label="Liksidig hörselnedsättning"
            options={["Ja", "Nej"]}
            selected={selectedSymmetrical}
            onChange={setSelectedSymmetrical}
          />

          {/* Active chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 border-t">
              {activeFilters.map((f) => (
                <FilterChip key={f.label} label={f.label} onRemove={f.clear} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts ── */}
      {data.totalSessions === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Inga sessioner matchar de valda filtren.
          </CardContent>
        </Card>
      ) : (
        <AnalysisCharts
          ageGroupCounts={data.ageGroupCounts}
          hnsGradeCounts={data.hnsGradeCounts}
          haTypeCounts={data.haTypeCounts}
          hearingLossTypes={data.hearingLossTypes}
          situationalAgg0to6={data.situationalAgg0to6}
          situationalAgg7to18={data.situationalAgg7to18}
          sessions0to6Count={data.sessions0to6Count}
          sessions7to18Count={data.sessions7to18Count}
          frequencyOptions={frequencyOptions}
        />
      )}
    </div>
  );
}
