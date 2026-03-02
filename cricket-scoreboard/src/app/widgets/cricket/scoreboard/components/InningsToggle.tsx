"use client";

import { useMatchStore } from "@/store/match-store";

export default function InningsToggle() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);
  const setSelected = useMatchStore((s) => s.setSelectedInnings);
  const currentLive = useMatchStore((s) => s.match?.currentInningsIndex ?? 0);

  if (!match) return null;

  return (
    <div className="flex gap-2">
      {match.innings.map((inn, i) => {
        const isSelected = selectedIdx === i;
        const isLive = inn.status === "in_progress";
        const notStarted = inn.status === "not_started";

        return (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${
                isSelected
                  ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/20"
                  : notStarted
                  ? "bg-surface text-muted/50 hover:bg-surface/80"
                  : "bg-surface text-foreground hover:bg-surface/80"
              }
            `}
          >
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75 animate-pulse-glow" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
              </span>
            )}
            <span>
              {inn.battingTeam.shortName} Innings
            </span>
            {notStarted && (
              <span className="text-[10px] text-muted/40 uppercase">
                (TBD)
              </span>
            )}
          </button>
        );
      })}

      {selectedIdx !== currentLive && match.innings[currentLive]?.status === "in_progress" && (
        <button
          onClick={() => setSelected(currentLive)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75 animate-pulse-glow" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
          </span>
          Jump to Live
        </button>
      )}
    </div>
  );
}
