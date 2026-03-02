"use client";

import { useMatchStore, type AISentiment } from "@/store/match-store";
import { motion, AnimatePresence } from "framer-motion";

const SENTIMENT_CONFIG: Record<
  AISentiment,
  { icon: string; gradient: string; border: string; badge: string; badgeText: string }
> = {
  positive: {
    icon: "⚡",
    gradient: "from-blue-950/60 to-card",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    badgeText: "MOMENTUM",
  },
  negative: {
    icon: "💔",
    gradient: "from-red-950/60 to-card",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-300",
    badgeText: "WICKET",
  },
  tense: {
    icon: "🎯",
    gradient: "from-amber-950/60 to-card",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    badgeText: "PRESSURE",
  },
  neutral: {
    icon: "🏏",
    gradient: "from-slate-900/60 to-card",
    border: "border-slate-500/20",
    badge: "bg-slate-500/20 text-slate-300",
    badgeText: "ANALYSIS",
  },
};

export default function AIAnalystCard() {
  const aiCommentary = useMatchStore((s) => s.aiCommentary);
  const isAILoading = useMatchStore((s) => s.isAILoading);

  const latest = aiCommentary[0];
  const history = aiCommentary.slice(1, 4);

  return (
    <div className="rounded-xl bg-card border border-card-border overflow-hidden">
      <div className="px-5 py-3 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
            AI Analyst
          </h3>
        </div>
        {isAILoading && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-1 h-1 rounded-full bg-purple-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted">Analysing...</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence mode="wait">
          {latest ? (
            <motion.div
              key={latest.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`rounded-lg border bg-gradient-to-br p-4 ${SENTIMENT_CONFIG[latest.sentiment].gradient} ${SENTIMENT_CONFIG[latest.sentiment].border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {SENTIMENT_CONFIG[latest.sentiment].icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded ${SENTIMENT_CONFIG[latest.sentiment].badge}`}
                    >
                      {SENTIMENT_CONFIG[latest.sentiment].badgeText}
                    </span>
                    <span className="text-[10px] text-muted/50">
                      {new Date(latest.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted/60 italic mb-1.5 border-l border-muted/20 pl-2">
                    {latest.ballCommentary}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {latest.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-dashed border-card-border p-6 text-center"
            >
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-xs text-muted">
                AI analyst activates on boundaries and wickets
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] text-muted uppercase tracking-wider font-medium">
              Previous Insights
            </div>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 rounded-lg bg-surface/40 px-3 py-2"
              >
                <span className="text-sm flex-shrink-0 opacity-60">
                  {SENTIMENT_CONFIG[entry.sentiment].icon}
                </span>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {entry.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
