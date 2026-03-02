import type { BowlerStat, Innings } from "@/types/cricket";

export function computeBPI(bowler: BowlerStat, _matchEconomyAvg: number): number {
  const oversDecimal = oversToDecimal(bowler.overs);
  if (oversDecimal === 0) return 0;

  if (bowler.economy >= 6) return 10;

  return Math.min(9, Math.round((bowler.economy / 6) * 9));
}

export function getMatchEconomyAvg(innings: Innings): number {
  if (innings.bowlers.length === 0) return 0;
  const totalRuns = innings.bowlers.reduce((s, b) => s + b.runs, 0);
  const totalOvers = innings.bowlers.reduce((s, b) => s + oversToDecimal(b.overs), 0);
  return totalOvers > 0 ? totalRuns / totalOvers : 0;
}

export function oversToDecimal(overs: number): number {
  const full = Math.floor(overs);
  const partialBalls = Math.round((overs - full) * 10);
  return full + partialBalls / 6;
}

export function getPressureLabel(bpi: number): { label: string; color: string } {
  if (bpi >= 10) return { label: "Extreme", color: "#ef4444" };
  if (bpi >= 7)  return { label: "High",    color: "#f97316" };
  if (bpi >= 4)  return { label: "Moderate", color: "#eab308" };
  return { label: "Low", color: "#22c55e" };
}
