"use client";

import { useMatchStore } from "@/store/match-store";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BallEvent } from "@/types/cricket";

const CX = 150;
const CY = 150;
const FIELD_RADIUS = 130;
const PITCH_LEN = 18;
const PITCH_W = 6;

function seededAngle(ballId: string): number {
  let hash = 0;
  for (let i = 0; i < ballId.length; i++) {
    hash = (hash * 31 + ballId.charCodeAt(i)) | 0;
  }
  return ((hash % 360) + 360) % 360;
}

function shotLine(ball: BallEvent): { x2: number; y2: number; color: string } {
  const angleDeg = seededAngle(ball.id);
  const angleRad = (angleDeg * Math.PI) / 180;

  let reach = 0;
  if (ball.isWicket) reach = 10;
  else if (ball.runs === 0) reach = 15 + (seededAngle(ball.id + "r") % 10);
  else if (ball.runs === 1) reach = 30 + (seededAngle(ball.id + "r") % 20);
  else if (ball.runs === 2) reach = 50 + (seededAngle(ball.id + "r") % 20);
  else if (ball.runs === 3) reach = 75 + (seededAngle(ball.id + "r") % 15);
  else if (ball.isFour) reach = 100 + (seededAngle(ball.id + "r") % 20);
  else if (ball.isSix) reach = FIELD_RADIUS - 5;
  else reach = 20 + (seededAngle(ball.id + "r") % 30);

  reach = Math.min(reach, FIELD_RADIUS - 5);

  const x2 = CX + reach * Math.sin(angleRad);
  const y2 = CY - reach * Math.cos(angleRad);

  let color = "#6b7280";
  if (ball.isWicket) color = "#ef4444";
  else if (ball.isSix) color = "#a855f7";
  else if (ball.isFour) color = "#3b82f6";
  else if (ball.runs >= 2) color = "#22c55e";
  else if (ball.runs === 1) color = "#94a3b8";
  else color = "#475569";

  return { x2, y2, color };
}

export default function WagonWheel() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  const inn = match?.innings[selectedIdx];
  const balls = inn?.ballLog ?? [];

  const shotData = useMemo(
    () => balls.slice(0, 60).map((b) => ({ ball: b, ...shotLine(b) })),
    [balls]
  );

  const stats = useMemo(() => {
    let dots = 0, ones = 0, twos = 0, fours = 0, sixes = 0;
    for (const b of balls) {
      if (b.isWicket || b.isWide) continue;
      if (b.runs === 0) dots++;
      else if (b.runs === 1) ones++;
      else if (b.runs === 2 || b.runs === 3) twos++;
      else if (b.isFour) fours++;
      else if (b.isSix) sixes++;
    }
    return { dots, ones, twos, fours, sixes };
  }, [balls]);

  if (!inn || inn.status === "not_started") return null;

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      <div className="px-5 py-3 border-b border-card-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Wagon Wheel
        </h3>
      </div>

      <div className="flex justify-center p-4">
        <svg
          viewBox="0 0 300 300"
          className="w-full max-w-[280px]"
          style={{ filter: "drop-shadow(0 0 12px rgba(59,130,246,0.08))" }}
        >
          <circle cx={CX} cy={CY} r={FIELD_RADIUS} fill="#0f1d14" stroke="#1e3a24" strokeWidth={1.5} />

          <circle cx={CX} cy={CY} r={80} fill="none" stroke="#1e3a24" strokeWidth={0.8} strokeDasharray="4 3" />

          <circle cx={CX} cy={CY} r={40} fill="none" stroke="#1e3a24" strokeWidth={0.5} strokeDasharray="2 3" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={CX}
                y1={CY}
                x2={CX + FIELD_RADIUS * Math.sin(rad)}
                y2={CY - FIELD_RADIUS * Math.cos(rad)}
                stroke="#1e3a24"
                strokeWidth={0.4}
              />
            );
          })}

          <rect
            x={CX - PITCH_W / 2}
            y={CY - PITCH_LEN / 2}
            width={PITCH_W}
            height={PITCH_LEN}
            rx={1.5}
            fill="#c4a35a"
            opacity={0.7}
          />

          <circle cx={CX} cy={CY + PITCH_LEN / 2 - 2} r={2.5} fill="#f59e0b" />

          <AnimatePresence initial={false}>
            {shotData.map(({ ball, x2, y2, color }) => (
              <motion.line
                key={ball.id}
                x1={CX}
                y1={CY + PITCH_LEN / 2 - 2}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={ball.isSix || ball.isFour ? 2 : 1.2}
                strokeLinecap="round"
                opacity={0.8}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {shotData.map(({ ball, x2, y2, color }) => (
            <circle
              key={`dot-${ball.id}`}
              cx={x2}
              cy={y2}
              r={ball.isSix ? 3.5 : ball.isFour ? 3 : ball.isWicket ? 3 : 2}
              fill={color}
              opacity={0.9}
            />
          ))}

          <text x={CX} y={12} textAnchor="middle" fontSize={8} fill="#4a5568" fontWeight={600}>STRAIGHT</text>
          <text x={CX} y={296} textAnchor="middle" fontSize={8} fill="#4a5568" fontWeight={600}>FINE LEG</text>
          <text x={14} y={CY + 3} textAnchor="middle" fontSize={8} fill="#4a5568" fontWeight={600}>OFF</text>
          <text x={286} y={CY + 3} textAnchor="middle" fontSize={8} fill="#4a5568" fontWeight={600}>ON</text>
        </svg>
      </div>

      <div className="px-4 pb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {[
          { color: "#475569", label: `Dots (${stats.dots})` },
          { color: "#94a3b8", label: `1s (${stats.ones})` },
          { color: "#22c55e", label: `2s/3s (${stats.twos})` },
          { color: "#3b82f6", label: `4s (${stats.fours})` },
          { color: "#a855f7", label: `6s (${stats.sixes})` },
          { color: "#ef4444", label: "Wicket" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-muted">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
