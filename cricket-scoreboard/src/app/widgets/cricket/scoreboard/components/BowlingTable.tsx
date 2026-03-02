"use client";

import { useMatchStore } from "@/store/match-store";
import { getPressureLabel } from "@/lib/bpi";

export default function BowlingTable() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  if (!match) return null;
  const inn = match.innings[selectedIdx];
  if (!inn || inn.status === "not_started") return null;

  const activeBowlers = inn.bowlers.filter(
    (b) => b.overs > 0 || b.wickets > 0 || b.runs > 0
  );

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      <div className="px-5 py-3 border-b border-card-border flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Bowling
        </h3>
        <span className="text-xs text-muted">
          {inn.bowlingTeam.name}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface/50 text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 font-medium">Bowler</th>
              <th className="text-right py-2.5 px-2 font-medium">O</th>
              <th className="text-right py-2.5 px-2 font-medium">M</th>
              <th className="text-right py-2.5 px-2 font-medium">R</th>
              <th className="text-right py-2.5 px-2 font-medium">W</th>
              <th className="text-right py-2.5 px-2 font-medium">Econ</th>
              <th className="text-right py-2.5 px-2 font-medium">Wd</th>
              <th className="text-right py-2.5 px-2 font-medium">Nb</th>
              <th className="text-right py-2.5 px-4 font-medium">
                <span className="inline-flex items-center gap-1">
                  BPI
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-muted/30 cursor-help"
                    title="Bowler Pressure Index (0–10): Economy ≥ 6 → BPI = 10 | Economy < 6 → BPI = floor((Econ/6)×9)"
                  >
                    <span className="flex items-center justify-center text-[8px] text-muted">
                      ?
                    </span>
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {activeBowlers.map((b) => {
              const pressure = getPressureLabel(b.bpiScore);
              return (
                <tr
                  key={b.player.id}
                  className="border-b border-card-border/50 hover:bg-surface/30 transition-colors"
                >
                  <td className="py-2.5 px-4 font-medium">
                    {b.player.shortName}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-muted">
                    {b.overs}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-muted">
                    {b.maidens}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {b.runs}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold">
                    {b.wickets}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {b.economy.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-muted">
                    {b.wides}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-muted">
                    {b.noBalls}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(b.bpiScore, 10) * 10}%`,
                            backgroundColor: pressure.color,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold font-mono min-w-[24px] text-right"
                        style={{ color: pressure.color }}
                      >
                        {b.bpiScore}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2 border-t border-card-border flex items-center gap-4">
        <span className="text-[10px] text-muted uppercase tracking-wider">
          BPI Scale:
        </span>
        {[
          { label: "Low", color: "#22c55e" },
          { label: "Moderate", color: "#eab308" },
          { label: "High", color: "#f97316" },
          { label: "Extreme", color: "#ef4444" },
        ].map((s) => (
          <span key={s.label} className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] text-muted">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
