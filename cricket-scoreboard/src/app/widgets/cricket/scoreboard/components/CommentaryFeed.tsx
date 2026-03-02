"use client";

import { useMatchStore } from "@/store/match-store";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentaryFeed() {
  const match = useMatchStore((s) => s.match);
  const selectedIdx = useMatchStore((s) => s.ui.selectedInningsIndex);

  if (!match) return null;
  const inn = match.innings[selectedIdx];
  if (!inn || inn.status === "not_started") return null;

  const balls = inn.ballLog.slice(0, 20);

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      <div className="px-5 py-3 border-b border-card-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Live Commentary
        </h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {balls.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">
            Waiting for ball events...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {balls.map((ball) => (
              <motion.div
                key={ball.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                className="border-b border-card-border/30 last:border-0"
              >
                <div className="flex items-start gap-3 px-5 py-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <BallBadge ball={ball} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted mb-0.5">
                      Over {ball.over}.{ball.ball}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {ball.commentary}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function BallBadge({ ball }: { ball: { runs: number; isWicket: boolean; isFour: boolean; isSix: boolean; isWide: boolean } }) {
  let bg = "bg-surface";
  let text = "text-muted";
  let label = String(ball.runs);

  if (ball.isWicket) {
    bg = "bg-accent-red/20";
    text = "text-accent-red";
    label = "W";
  } else if (ball.isSix) {
    bg = "bg-purple-500/20";
    text = "text-purple-400";
    label = "6";
  } else if (ball.isFour) {
    bg = "bg-accent-blue/20";
    text = "text-accent-blue";
    label = "4";
  } else if (ball.isWide) {
    bg = "bg-accent-amber/20";
    text = "text-accent-amber";
    label = "Wd";
  } else if (ball.runs === 0) {
    bg = "bg-surface";
    text = "text-muted/50";
    label = "0";
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
