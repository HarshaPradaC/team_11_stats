"use client";

import { useEffect, useRef } from "react";
import { useMatchStore } from "@/store/match-store";
import type { BallEvent } from "@/types/cricket";
import type { AICommentaryEntry } from "@/store/match-store";

function isMeaningfulBall(ball: BallEvent): boolean {
  return ball.isWicket || ball.isSix || ball.isFour || ball.runs >= 2;
}

async function fetchAICommentary(
  ball: BallEvent,
  matchSnapshot: ReturnType<typeof useMatchStore.getState>["match"]
): Promise<AICommentaryEntry | null> {
  if (!matchSnapshot) return null;

  const inn = matchSnapshot.innings[ball.inningsIndex];
  if (!inn) return null;

  const batsman = inn.batsmen.find((b) => b.player.id === ball.batsmanId);
  const bowler = inn.bowlers.find((b) => b.player.id === ball.bowlerId);

  try {
    const res = await fetch("/api/ai-commentary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentary: ball.commentary,
        runs: ball.runs,
        isWicket: ball.isWicket,
        isFour: ball.isFour,
        isSix: ball.isSix,
        isWide: ball.isWide,
        batsmanName: batsman?.player.name ?? "the batsman",
        bowlerName: bowler?.player.name ?? "the bowler",
        totalRuns: inn.totalRuns,
        wickets: inn.wickets,
        overs: `${inn.overs}.${inn.balls}`,
        target: inn.target,
        format: matchSnapshot.format,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.text) return null;

    return {
      id: `ai_${ball.id}`,
      text: data.text,
      sentiment: data.sentiment,
      ballCommentary: ball.commentary,
      timestamp: ball.timestamp,
    };
  } catch {
    return null;
  }
}

export function useSSE() {
  const applyBallEvent = useMatchStore((s) => s.applyBallEvent);
  const setConnectionStatus = useMatchStore((s) => s.setConnectionStatus);
  const setMatch = useMatchStore((s) => s.setMatch);
  const addAICommentary = useMatchStore((s) => s.addAICommentary);
  const setAILoading = useMatchStore((s) => s.setAILoading);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetch("/api/match")
      .then((r) => r.json())
      .then((data) => setMatch(data))
      .catch(() => setConnectionStatus("offline"));

    const connect = () => {
      const es = new EventSource("/api/sse");
      esRef.current = es;

      es.onopen = () => setConnectionStatus("connected");

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ball") {
            const ball = data.payload as BallEvent;

            applyBallEvent(ball);

            if (isMeaningfulBall(ball)) {
              setAILoading(true);
              const snapshot = useMatchStore.getState().match;
              fetchAICommentary(ball, snapshot).then((entry) => {
                if (entry) addAICommentary(entry);
                else setAILoading(false);
              });
            }
          }
          if (data.type === "match_end") {
            setConnectionStatus("offline");
            es.close();
          }
        } catch {
        }
      };

      es.onerror = () => {
        setConnectionStatus("reconnecting");
        es.close();
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      esRef.current?.close();
    };
  }, [applyBallEvent, setConnectionStatus, setMatch, addAICommentary, setAILoading]);
}
