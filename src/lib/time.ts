/** Converts a decimal hour string (e.g. "1.50") into separate hours and minutes strings. */
export function splitTime(val: string | null | undefined): { hours: string; minutes: string } {
    if (!val || val === "") return { hours: "", minutes: "" };
    const n = parseFloat(val);
    if (isNaN(n)) return { hours: "", minutes: "" };
    const h = Math.floor(n);
    const m = Math.round((n - h) * 60);
    return { hours: h > 0 ? String(h) : "", minutes: m > 0 ? String(m) : "" };
}
