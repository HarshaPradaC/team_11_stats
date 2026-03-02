"use client";

import { useMatchStore } from "@/store/match-store";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentBalls() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  if (!match) return null;
  const inn = match.innings[selectedIdx];
  if (!inn || inn.status === "not_started") return null;

  const recent = inn.ballLog.slice(0, 12);

  return (
    <div className="rounded-xl bg-card border border-card-border p-4">
      <div className="text-xs text-muted uppercase tracking-wider font-medium mb-3">
        Recent Deliveries
      </div>
      <div className="flex gap-2 flex-wrap">
        <AnimatePresence initial={false}>
          {recent.map((ball) => {
            let bg = "bg-surface";
            let text = "text-foreground";
            let label = String(ball.runs);

            if (ball.isWicket) {
              bg = "bg-accent-red";
              text = "text-white";
              label = "W";
            } else if (ball.isSix) {
              bg = "bg-purple-500";
              text = "text-white";
            } else if (ball.isFour) {
              bg = "bg-accent-blue";
              text = "text-white";
            } else if (ball.isWide) {
              bg = "bg-accent-amber/30";
              text = "text-accent-amber";
              label = "Wd";
            } else if (ball.runs === 0) {
              bg = "bg-surface";
              text = "text-muted/50";
            }

            return (
              <motion.span
                key={ball.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold ${bg} ${text}`}
              >
                {label}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
