import { INITIAL_MATCH, generateRandomBall } from "@/lib/mock-data";
import type { Match } from "@/types/cricket";

export const dynamic = "force-dynamic";

export async function GET() {
  const match: Match = structuredClone(INITIAL_MATCH);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const interval = setInterval(() => {
        const ball = generateRandomBall(match);
        if (!ball) {
          clearInterval(interval);
          send({ type: "match_end" });
          controller.close();
          return;
        }

        const inn = match.innings[match.currentInningsIndex];
        inn.totalRuns += ball.runs;

        if (ball.isWide) {
          inn.extras.wides += 1;
          inn.extras.total += 1;
        } else {
          inn.balls += 1;
          if (inn.balls >= 6) {
            inn.overs += 1;
            inn.balls = 0;
          }
        }

        if (ball.isWicket) {
          inn.wickets += 1;
          if (inn.wickets >= 10) {
            inn.status = "completed";
            if (match.currentInningsIndex === 0 && match.innings[1]) {
              match.innings[1].status = "in_progress";
              match.innings[1].target = inn.totalRuns + 1;
              match.currentInningsIndex = 1;
            }
          }
        }

        if (inn.overs >= match.totalOversPerInnings && inn.balls === 0) {
          inn.status = "completed";
          if (match.currentInningsIndex === 0 && match.innings[1]) {
            match.innings[1].status = "in_progress";
            match.innings[1].target = inn.totalRuns + 1;
            match.currentInningsIndex = 1;
          }
        }

        send({ type: "ball", payload: ball });
      }, 3000);

      const cleanup = () => clearInterval(interval);
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      (controller as unknown as { _cleanup?: () => void })._cleanup = cleanup;
    },
    cancel() {
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
