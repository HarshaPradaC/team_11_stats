"use client";

import { useMatchStore } from "@/store/match-store";

export default function MatchHeader() {
  const match = useMatchStore((s) => s.match);
  const connectionStatus = useMatchStore((s) => s.connectionStatus);

  if (!match) return null;
  const [teamA, teamB] = match.teams;

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      {/* Brand bar */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-card-border/60"
        style={{ background: "linear-gradient(90deg, #1e3a5f 0%, #111827 100%)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏏</span>
          <span className="text-base font-extrabold tracking-tight text-white">
            Cric<span style={{ color: "#38bdf8" }}>Zen</span>
          </span>
          <span className="text-[10px] text-blue-300/60 uppercase tracking-widest font-medium ml-1">
            Live Cricket Hub
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status={connectionStatus} />
          <span className="text-xs font-medium uppercase tracking-wider text-blue-100/70">
            {connectionStatus === "connected"
              ? "Live"
              : connectionStatus === "reconnecting"
              ? "Reconnecting..."
              : connectionStatus === "stale"
              ? "Stale"
              : "Offline"}
          </span>
        </div>
      </div>

      {/* Match info bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{teamA.flagEmoji}</span>
            <span className="text-lg font-bold">{teamA.shortName}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-muted text-xs font-semibold uppercase tracking-widest">vs</span>
            <span className="text-[10px] text-muted/50 font-medium">{match.format}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{teamB.flagEmoji}</span>
            <span className="text-lg font-bold">{teamB.shortName}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-muted/70">{match.venue}</div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "connected"
      ? "bg-accent-green"
      : status === "reconnecting"
      ? "bg-accent-amber"
      : "bg-accent-red";

  return (
    <span className="relative flex h-3 w-3">
      {status === "connected" && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-pulse-glow`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}
