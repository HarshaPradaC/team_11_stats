"use client";

import { useSSE } from "@/hooks/use-sse";
import { useMatchStore } from "@/store/match-store";
import MatchHeader from "./components/MatchHeader";
import InningsToggle from "./components/InningsToggle";
import ScoreHeader from "./components/ScoreHeader";
import BattingTable from "./components/BattingTable";
import BowlingTable from "./components/BowlingTable";
import CommentaryFeed from "./components/CommentaryFeed";
import RecentBalls from "./components/RecentBalls";
import WagonWheel from "./components/WagonWheel";
import AIAnalystCard from "./components/AIAnalystCard";

export default function ScoreboardClient() {
  useSSE();
  const match = useMatchStore((s) => s.match);

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted">Loading match data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        <MatchHeader />

        <InningsToggle />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <ScoreHeader />
            <RecentBalls />
            <BattingTable />
            <BowlingTable />
          </div>

          <div className="space-y-5">
            <AIAnalystCard />
            <WagonWheel />
            <CommentaryFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
