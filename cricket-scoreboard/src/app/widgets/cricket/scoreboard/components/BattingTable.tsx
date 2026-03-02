"use client";

import { useMatchStore } from "@/store/match-store";
import { motion } from "framer-motion";

export default function BattingTable() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  if (!match) return null;
  const inn = match.innings[selectedIdx];
  if (!inn || inn.status === "not_started") return null;

  const active = inn.batsmen.filter((b) => b.status !== "yet_to_bat");
  const yetToBat = inn.batsmen.filter((b) => b.status === "yet_to_bat");

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      <div className="px-5 py-3 border-b border-card-border flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Batting
        </h3>
        <span className="text-xs text-muted">
          {inn.battingTeam.name}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface/50 text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 font-medium">Batter</th>
              <th className="text-left py-2.5 px-4 font-medium w-[200px]">
                Dismissal
              </th>
              <th className="text-right py-2.5 px-2 font-medium">R</th>
              <th className="text-right py-2.5 px-2 font-medium">B</th>
              <th className="text-right py-2.5 px-2 font-medium">4s</th>
              <th className="text-right py-2.5 px-2 font-medium">6s</th>
              <th className="text-right py-2.5 px-4 font-medium">SR</th>
            </tr>
          </thead>
          <tbody>
            {active.map((b) => (
              <motion.tr
                key={b.player.id}
                initial={false}
                animate={{
                  backgroundColor:
                    b.status === "batting"
                      ? "rgba(59, 130, 246, 0.08)"
                      : "transparent",
                }}
                className={`border-b border-card-border/50 transition-colors ${
                  b.status === "batting" ? "font-semibold" : ""
                }`}
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <span>{b.player.shortName}</span>
                    {b.status === "batting" && (
                      <span className="text-accent-green text-[10px] font-bold">
                        *
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4 text-muted text-xs">
                  {b.status === "batting"
                    ? "not out"
                    : b.status === "not_out"
                    ? "not out"
                    : b.dismissalText}
                </td>
                <td className="py-2.5 px-2 text-right font-mono">
                  <motion.span
                    key={b.runs}
                    initial={{ scale: 1.3, color: "#3b82f6" }}
                    animate={{ scale: 1, color: "inherit" }}
                    transition={{ duration: 0.4 }}
                  >
                    {b.runs}
                  </motion.span>
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-muted">
                  {b.balls}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-muted">
                  {b.fours}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-muted">
                  {b.sixes}
                </td>
                <td className="py-2.5 px-4 text-right font-mono">
                  {b.strikeRate.toFixed(1)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {yetToBat.length > 0 && (
        <div className="px-5 py-3 border-t border-card-border">
          <span className="text-xs text-muted uppercase tracking-wider font-medium">
            Yet to bat:{" "}
          </span>
          <span className="text-xs text-muted/70">
            {yetToBat.map((b) => b.player.shortName).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
