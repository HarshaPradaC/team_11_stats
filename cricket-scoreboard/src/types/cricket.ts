export interface Player {
  id: string;
  name: string;
  shortName: string;
}

export interface BatsmanStat {
  player: Player;
  status: "yet_to_bat" | "batting" | "out" | "not_out";
  dismissalText: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export interface BowlerStat {
  player: Player;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
  bpiScore: number;
}

export interface Extras {
  total: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
}

export interface BallEvent {
  id: string;
  inningsIndex: number;
  over: number;
  ball: number;
  runs: number;
  isWicket: boolean;
  isFour: boolean;
  isSix: boolean;
  isWide: boolean;
  isNoBall: boolean;
  isMaiden: boolean;
  batsmanId: string;
  bowlerId: string;
  commentary: string;
  timestamp: number;
}

export interface Innings {
  index: number;
  status: "not_started" | "in_progress" | "completed";
  battingTeam: Team;
  bowlingTeam: Team;
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  target: number | null;
  batsmen: BatsmanStat[];
  bowlers: BowlerStat[];
  extras: Extras;
  ballLog: BallEvent[];
  currentRunRate: number;
  requiredRunRate: number | null;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  flagEmoji: string;
}

export interface Match {
  id: string;
  format: "T20" | "ODI" | "TEST";
  status: "live" | "completed" | "upcoming";
  venue: string;
  teams: [Team, Team];
  innings: Innings[];
  currentInningsIndex: number;
  totalOversPerInnings: number;
}

export type ConnectionStatus = "connected" | "reconnecting" | "stale" | "offline";
