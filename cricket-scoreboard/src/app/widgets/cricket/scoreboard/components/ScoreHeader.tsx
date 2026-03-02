"use client";

import { useMatchStore } from "@/store/match-store";
import { motion, AnimatePresence } from "framer-motion";

export default function ScoreHeader() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  if (!match) return null;
  const inn = match.innings[selectedIdx];
  if (!inn) return null;

  if (inn.status === "not_started") {
    return (
      <div className="flex items-center justify-center rounded-xl bg-card border border-card-border p-10">
        <div className="text-center">
          <div className="text-4xl mb-3">🏏</div>
          <h3 className="text-lg font-semibold text-muted">
            Innings not yet started
          </h3>
          <p className="text-sm text-muted/70 mt-1">
            {inn.battingTeam.name} will bat when ready
          </p>
        </div>
      </div>
    );
  }

  const oversDisplay = `${inn.overs}.${inn.balls}`;

  return (
    <div
      className="rounded-xl border border-card-border p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${inn.battingTeam.color}15, var(--card))`,
      }}
    >
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: inn.battingTeam.color }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{inn.battingTeam.flagEmoji}</span>
          <div>
            <div className="text-sm text-muted uppercase tracking-widest font-medium">
              {inn.battingTeam.name} {inn.status === "completed" ? "(Completed)" : "Batting"}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={inn.totalRuns}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-5xl font-bold tracking-tight font-mono"
                >
                  {inn.totalRuns}
                </motion.span>
              </AnimatePresence>
              <span className="text-2xl text-muted font-medium">
                / {inn.wickets}
              </span>
            </div>
            <div className="text-sm text-muted mt-1">
              {oversDisplay} overs
            </div>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="rounded-lg bg-surface px-4 py-2">
            <div className="text-xs text-muted uppercase tracking-wider">
              CRR
            </div>
            <div className="text-xl font-bold font-mono text-accent-blue">
              {inn.currentRunRate.toFixed(2)}
            </div>
          </div>
          {inn.requiredRunRate !== null && inn.requiredRunRate > 0 && (
            <div className="rounded-lg bg-surface px-4 py-2">
              <div className="text-xs text-muted uppercase tracking-wider">
                RRR
              </div>
              <div
                className={`text-xl font-bold font-mono ${
                  inn.requiredRunRate > inn.currentRunRate
                    ? "text-accent-red"
                    : "text-accent-green"
                }`}
              >
                {inn.requiredRunRate.toFixed(2)}
              </div>
            </div>
          )}
          {inn.target && (
            <div className="text-xs text-muted">
              Target: {inn.target}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-card-border">
        <div className="text-xs text-muted">
          Extras: {inn.extras.total}{" "}
          <span className="text-muted/60">
            (w {inn.extras.wides}, nb {inn.extras.noBalls}, b {inn.extras.byes},
            lb {inn.extras.legByes})
          </span>
        </div>
      </div>
    </div>
  );
}
