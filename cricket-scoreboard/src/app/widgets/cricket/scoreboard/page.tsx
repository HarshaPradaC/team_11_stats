import type { Metadata } from "next";
import ScoreboardClient from "./ScoreboardClient";

export const metadata: Metadata = {
  title: "IND vs AUS · Live Scoreboard",
  description: "CricZen — Live ball-by-ball cricket scoreboard with Bowler Pressure Index and AI match analysis",
};

export default function ScoreboardPage() {
  return <ScoreboardClient />;
}
