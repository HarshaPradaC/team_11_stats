import type { Match, BallEvent } from "@/types/cricket";

const INDIA = {
  id: "ind",
  name: "India",
  shortName: "IND",
  color: "#1e40af",
  flagEmoji: "🇮🇳",
};

const AUSTRALIA = {
  id: "aus",
  name: "Australia",
  shortName: "AUS",
  color: "#ca8a04",
  flagEmoji: "🇦🇺",
};

const indBatsmen = [
  { id: "p1", name: "Rohit Sharma", shortName: "RG Sharma" },
  { id: "p2", name: "Shubman Gill", shortName: "S Gill" },
  { id: "p3", name: "Virat Kohli", shortName: "V Kohli" },
  { id: "p4", name: "KL Rahul", shortName: "KL Rahul" },
  { id: "p5", name: "Rishabh Pant", shortName: "RR Pant" },
  { id: "p6", name: "Hardik Pandya", shortName: "HH Pandya" },
  { id: "p7", name: "Ravindra Jadeja", shortName: "RA Jadeja" },
  { id: "p8", name: "Kuldeep Yadav", shortName: "K Yadav" },
  { id: "p9", name: "Jasprit Bumrah", shortName: "JJ Bumrah" },
  { id: "p10", name: "Mohammed Siraj", shortName: "M Siraj" },
  { id: "p11", name: "Mohammed Shami", shortName: "M Shami" },
];

const ausBowlers = [
  { id: "a1", name: "Pat Cummins", shortName: "PJ Cummins" },
  { id: "a2", name: "Mitchell Starc", shortName: "MA Starc" },
  { id: "a3", name: "Josh Hazlewood", shortName: "JR Hazlewood" },
  { id: "a4", name: "Adam Zampa", shortName: "A Zampa" },
  { id: "a5", name: "Glenn Maxwell", shortName: "GJ Maxwell" },
];

const ausBatsmen = [
  { id: "a6", name: "Travis Head", shortName: "TM Head" },
  { id: "a7", name: "David Warner", shortName: "DA Warner" },
  { id: "a8", name: "Steve Smith", shortName: "SPD Smith" },
  { id: "a9", name: "Marnus Labuschagne", shortName: "M Labuschagne" },
  { id: "a10", name: "Mitchell Marsh", shortName: "MR Marsh" },
  { id: "a11", name: "Alex Carey", shortName: "AT Carey" },
  ...ausBowlers.slice(0, 5),
];

const indBowlers = [
  { id: "p9", name: "Jasprit Bumrah", shortName: "JJ Bumrah" },
  { id: "p10", name: "Mohammed Siraj", shortName: "M Siraj" },
  { id: "p11", name: "Mohammed Shami", shortName: "M Shami" },
  { id: "p6", name: "Hardik Pandya", shortName: "HH Pandya" },
  { id: "p8", name: "Kuldeep Yadav", shortName: "K Yadav" },
];

export const INITIAL_MATCH: Match = {
  id: "match_001",
  format: "ODI",
  status: "live",
  venue: "Melbourne Cricket Ground, Melbourne",
  teams: [INDIA, AUSTRALIA],
  currentInningsIndex: 0,
  totalOversPerInnings: 50,
  innings: [
    {
      index: 0,
      status: "in_progress",
      battingTeam: INDIA,
      bowlingTeam: AUSTRALIA,
      totalRuns: 187,
      wickets: 4,
      overs: 34,
      balls: 0,
      target: null,
      currentRunRate: 5.5,
      requiredRunRate: null,
      extras: { total: 8, wides: 3, noBalls: 1, byes: 2, legByes: 2 },
      batsmen: [
        { player: indBatsmen[0], status: "out", dismissalText: "c Carey b Starc", runs: 45, balls: 52, fours: 5, sixes: 2, strikeRate: 86.5 },
        { player: indBatsmen[1], status: "out", dismissalText: "lbw b Hazlewood", runs: 22, balls: 34, fours: 3, sixes: 0, strikeRate: 64.7 },
        { player: indBatsmen[2], status: "batting", dismissalText: "", runs: 62, balls: 71, fours: 6, sixes: 1, strikeRate: 87.3 },
        { player: indBatsmen[3], status: "out", dismissalText: "b Zampa", runs: 8, balls: 15, fours: 1, sixes: 0, strikeRate: 53.3 },
        { player: indBatsmen[4], status: "batting", dismissalText: "", runs: 34, balls: 28, fours: 3, sixes: 2, strikeRate: 121.4 },
        { player: indBatsmen[5], status: "out", dismissalText: "c Head b Cummins", runs: 12, balls: 18, fours: 1, sixes: 0, strikeRate: 66.7 },
        { player: indBatsmen[6], status: "yet_to_bat", dismissalText: "", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        { player: indBatsmen[7], status: "yet_to_bat", dismissalText: "", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        { player: indBatsmen[8], status: "yet_to_bat", dismissalText: "", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        { player: indBatsmen[9], status: "yet_to_bat", dismissalText: "", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
        { player: indBatsmen[10], status: "yet_to_bat", dismissalText: "", runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
      ],
      bowlers: [
        { player: ausBowlers[0], overs: 8, maidens: 1, runs: 38, wickets: 1, economy: 4.75, wides: 1, noBalls: 0, bpiScore: 0 },
        { player: ausBowlers[1], overs: 7, maidens: 0, runs: 42, wickets: 1, economy: 6.0, wides: 1, noBalls: 0, bpiScore: 0 },
        { player: ausBowlers[2], overs: 7, maidens: 2, runs: 28, wickets: 1, economy: 4.0, wides: 0, noBalls: 1, bpiScore: 0 },
        { player: ausBowlers[3], overs: 8, maidens: 0, runs: 52, wickets: 1, economy: 6.5, wides: 1, noBalls: 0, bpiScore: 0 },
        { player: ausBowlers[4], overs: 4, maidens: 0, runs: 27, wickets: 0, economy: 6.75, wides: 0, noBalls: 0, bpiScore: 0 },
      ],
      ballLog: [],
    },
    {
      index: 1,
      status: "not_started",
      battingTeam: AUSTRALIA,
      bowlingTeam: INDIA,
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      target: null,
      currentRunRate: 0,
      requiredRunRate: null,
      extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
      batsmen: ausBatsmen.map((p) => ({
        player: p,
        status: "yet_to_bat" as const,
        dismissalText: "",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
      })),
      bowlers: indBowlers.map((p) => ({
        player: p,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
        wides: 0,
        noBalls: 0,
        bpiScore: 0,
      })),
      ballLog: [],
    },
  ],
};

const commentaryTemplates = {
  dot: [
    "{bowler} to {batsman}, no run, defended back down the pitch",
    "{bowler} to {batsman}, no run, pushed to cover",
    "{bowler} to {batsman}, no run, beaten outside off!",
    "{bowler} to {batsman}, no run, good length, left alone",
  ],
  single: [
    "{bowler} to {batsman}, 1 run, tucked to leg for a single",
    "{bowler} to {batsman}, 1 run, pushed through mid-off",
    "{bowler} to {batsman}, 1 run, deftly worked to fine leg",
  ],
  two: [
    "{bowler} to {batsman}, 2 runs, driven through the gap at cover",
    "{bowler} to {batsman}, 2 runs, pulled wide of mid-on",
  ],
  three: [
    "{bowler} to {batsman}, 3 runs, sweeps it fine, they come back for three",
  ],
  four: [
    "{bowler} to {batsman}, FOUR! Cracked through covers!",
    "{bowler} to {batsman}, FOUR! Driven past mid-off, racing to the boundary!",
    "{bowler} to {batsman}, FOUR! Cut hard, beats point!",
  ],
  six: [
    "{bowler} to {batsman}, SIX! Massive hit over long-on!",
    "{bowler} to {batsman}, SIX! Slog-swept into the stands!",
    "{bowler} to {batsman}, SIX! Lofted straight down the ground!",
  ],
  wicket: [
    "{bowler} to {batsman}, OUT! Caught at slip! What a delivery!",
    "{bowler} to {batsman}, OUT! Clean bowled! The stumps are shattered!",
    "{bowler} to {batsman}, OUT! Caught behind! Thin edge, keeper takes it!",
    "{bowler} to {batsman}, OUT! LBW! Trapped in front, dead plumb!",
  ],
  wide: [
    "{bowler} to {batsman}, wide, drifting down leg side",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let ballSeq = 0;
export function generateRandomBall(match: Match): BallEvent | null {
  const inn = match.innings[match.currentInningsIndex];
  if (!inn || inn.status !== "in_progress") return null;
  if (inn.wickets >= 10) return null;

  const currentOvers = inn.overs;
  const currentBalls = inn.balls;
  const nextBall = currentBalls + 1;
  const overComplete = nextBall >= 6;

  const activeBatsmen = inn.batsmen.filter((b) => b.status === "batting");
  const currentBowlers = inn.bowlers.filter((b) => b.overs > 0 || b.runs > 0 || b.wickets > 0);
  const batsman = activeBatsmen.length > 0 ? pick(activeBatsmen) : inn.batsmen[0];
  const bowler = currentBowlers.length > 0 ? pick(currentBowlers) : inn.bowlers[0];

  const rand = Math.random();
  let runs = 0;
  let isWicket = false;
  let isFour = false;
  let isSix = false;
  let isWide = false;
  let type: keyof typeof commentaryTemplates = "dot";

  if (rand < 0.03) {
    isWicket = true;
    type = "wicket";
  } else if (rand < 0.06) {
    isWide = true;
    runs = 1;
    type = "wide";
  } else if (rand < 0.10) {
    runs = 6;
    isSix = true;
    type = "six";
  } else if (rand < 0.22) {
    runs = 4;
    isFour = true;
    type = "four";
  } else if (rand < 0.27) {
    runs = 3;
    type = "three";
  } else if (rand < 0.40) {
    runs = 2;
    type = "two";
  } else if (rand < 0.65) {
    runs = 1;
    type = "single";
  } else {
    runs = 0;
    type = "dot";
  }

  const template = pick(commentaryTemplates[type]);
  const commentary = template
    .replace("{bowler}", bowler.player.shortName)
    .replace("{batsman}", batsman.player.shortName);

  ballSeq++;
  return {
    id: `ball_${ballSeq}`,
    inningsIndex: match.currentInningsIndex,
    over: overComplete && !isWide ? currentOvers + 1 : currentOvers,
    ball: isWide ? currentBalls : (overComplete ? 0 : nextBall),
    runs,
    isWicket,
    isFour,
    isSix,
    isWide,
    isNoBall: false,
    isMaiden: false,
    batsmanId: batsman.player.id,
    bowlerId: bowler.player.id,
    commentary,
    timestamp: Date.now(),
  };
}
