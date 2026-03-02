"use client";

import { create } from "zustand";
import type { Match, BallEvent, ConnectionStatus, Innings } from "@/types/cricket";
import { computeBPI, getMatchEconomyAvg } from "@/lib/bpi";

export type AISentiment = "positive" | "negative" | "neutral" | "tense";

export interface AICommentaryEntry {
  id: string;
  text: string;
  sentiment: AISentiment;
  ballCommentary: string;
  timestamp: number;
}

interface UIState {
  selectedInningsIndex: number;
}

interface MatchStore {
  match: Match | null;
  ui: UIState;
  connectionStatus: ConnectionStatus;
  lastReceivedAt: number;
  aiCommentary: AICommentaryEntry[];
  isAILoading: boolean;

  setMatch: (match: Match) => void;
  setSelectedInnings: (index: number) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  applyBallEvent: (ball: BallEvent) => void;
  addAICommentary: (entry: AICommentaryEntry) => void;
  setAILoading: (loading: boolean) => void;
}

function recalcBPI(innings: Innings): void {
  const avgEcon = getMatchEconomyAvg(innings);
  for (const b of innings.bowlers) {
    b.bpiScore = computeBPI(b, avgEcon);
  }
}

export const useMatchStore = create<MatchStore>((set) => ({
  match: null,
  ui: { selectedInningsIndex: 0 },
  connectionStatus: "offline",
  lastReceivedAt: 0,
  aiCommentary: [],
  isAILoading: false,

  setMatch: (match) =>
    set(() => {
      for (const inn of match.innings) recalcBPI(inn);
      return { match, lastReceivedAt: Date.now() };
    }),

  setSelectedInnings: (index) =>
    set((state) => ({
      ui: { ...state.ui, selectedInningsIndex: index },
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  applyBallEvent: (ball) =>
    set((state) => {
      if (!state.match) return {};
      const match = structuredClone(state.match);
      const inn = match.innings[ball.inningsIndex];
      if (!inn) return {};

      inn.ballLog.unshift(ball);

      inn.totalRuns += ball.runs;

      if (ball.isWide) {
        inn.extras.total += 1;
        inn.extras.wides += 1;
      } else {
        inn.balls += 1;
        if (inn.balls >= 6) {
          inn.overs += 1;
          inn.balls = 0;
        }
      }

      if (ball.isWicket) {
        inn.wickets += 1;
        const batter = inn.batsmen.find((b) => b.player.id === ball.batsmanId);
        if (batter) {
          batter.status = "out";
          batter.dismissalText = ball.commentary.split("OUT!")[1]?.trim() || "out";
        }
        const next = inn.batsmen.find((b) => b.status === "yet_to_bat");
        if (next) next.status = "batting";
      }

      const batter = inn.batsmen.find((b) => b.player.id === ball.batsmanId);
      if (batter && !ball.isWide) {
        batter.runs += ball.runs;
        batter.balls += 1;
        if (ball.isFour) batter.fours += 1;
        if (ball.isSix) batter.sixes += 1;
        batter.strikeRate = batter.balls > 0
          ? Math.round((batter.runs / batter.balls) * 1000) / 10
          : 0;
      }

      const bowler = inn.bowlers.find((b) => b.player.id === ball.bowlerId);
      if (bowler) {
        bowler.runs += ball.runs;
        if (ball.isWicket) bowler.wickets += 1;
        if (ball.isWide) bowler.wides += 1;
        if (!ball.isWide) {
          const bBalls = Math.round((bowler.overs - Math.floor(bowler.overs)) * 10) + 1;
          if (bBalls >= 6) {
            bowler.overs = Math.floor(bowler.overs) + 1;
          } else {
            bowler.overs = Math.floor(bowler.overs) + bBalls / 10;
          }
          const decOvers = Math.floor(bowler.overs) + Math.round((bowler.overs - Math.floor(bowler.overs)) * 10) / 6;
          bowler.economy = decOvers > 0 ? Math.round((bowler.runs / decOvers) * 100) / 100 : 0;
        }
      }

      const totalDecOvers = inn.overs + inn.balls / 6;
      inn.currentRunRate = totalDecOvers > 0 ? Math.round((inn.totalRuns / totalDecOvers) * 100) / 100 : 0;

      if (inn.target && inn.target > 0) {
        const remaining = inn.target - inn.totalRuns;
        const oversLeft = match.totalOversPerInnings - totalDecOvers;
        inn.requiredRunRate = oversLeft > 0 ? Math.round((remaining / oversLeft) * 100) / 100 : 0;
      }

      if (inn.wickets >= 10 || (inn.overs >= match.totalOversPerInnings && inn.balls === 0)) {
        inn.status = "completed";
        if (ball.inningsIndex === 0 && match.innings[1]) {
          match.innings[1].status = "in_progress";
          match.innings[1].target = inn.totalRuns + 1;
          match.currentInningsIndex = 1;
          const firstTwo = match.innings[1].batsmen.slice(0, 2);
          firstTwo.forEach((b) => (b.status = "batting"));
        }
      }

      recalcBPI(inn);

      return { match, lastReceivedAt: Date.now() };
    }),

  addAICommentary: (entry) =>
    set((state) => ({
      aiCommentary: [entry, ...state.aiCommentary].slice(0, 15),
      isAILoading: false,
    })),

  setAILoading: (loading) => set({ isAILoading: loading }),
}));
