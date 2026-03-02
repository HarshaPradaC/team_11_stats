import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      commentary,
      runs,
      isWicket,
      isFour,
      isSix,
      isWide,
      batsmanName,
      bowlerName,
      totalRuns,
      wickets,
      overs,
      target,
      format,
    } = body;

    const matchContext = target
      ? `${format} match. ${batsmanName}'s team needs ${target - totalRuns} runs from ${(50 - overs).toFixed(1)} overs. Score: ${totalRuns}/${wickets}.`
      : `${format} match. Current score: ${totalRuns}/${wickets} in ${overs} overs.`;

    const ballDesc = isWicket
      ? `WICKET — ${batsmanName} is OUT. Bowled by ${bowlerName}.`
      : isSix
      ? `SIX — ${batsmanName} hits ${bowlerName} for a massive six!`
      : isFour
      ? `FOUR — ${batsmanName} drives ${bowlerName} for a boundary!`
      : isWide
      ? `Wide ball by ${bowlerName}.`
      : runs === 0
      ? `Dot ball. ${bowlerName} beats ${batsmanName}.`
      : `${runs} run${runs > 1 ? "s" : ""} scored by ${batsmanName} off ${bowlerName}.`;

    const prompt = `You are a passionate, emotionally intelligent cricket analyst providing LIVE ball-by-ball insights for fans watching a match.

Match context: ${matchContext}
Ball event: ${ballDesc}
Standard commentary: "${commentary}"

Generate ONE short, emotionally rich analyst insight (2-3 sentences max). 
- Capture the sentiment: tension, joy, heartbreak, excitement, or relief
- Speak directly to the fan's emotions — what are they feeling right now?
- Reference the match pressure, player form, or what this moment means
- Be dramatic but accurate. No fluff.
- Do NOT repeat the standard commentary. Add emotional depth and analytical value.
- End with what fans should watch for next.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.85,
    });

    const aiText = completion.choices[0]?.message?.content?.trim() ?? "";

    const sentiment: "positive" | "negative" | "neutral" | "tense" =
      isWicket
        ? "negative"
        : isSix || isFour
        ? "positive"
        : runs === 0
        ? "tense"
        : "neutral";

    return NextResponse.json({ text: aiText, sentiment });
  } catch (err) {
    console.error("AI commentary error:", err);
    return NextResponse.json({ text: "", sentiment: "neutral" }, { status: 500 });
  }
}
