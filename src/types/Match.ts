import type { TeamId } from "./Team";

export type MatchFormat = "scramble" | "four-ball" | "singles";
export type ScoringType = "gross" | "net";
export type MatchStatus = "scheduled" | "in-progress" | "complete";

export interface MatchSide {
  team: TeamId;
  playerIds: string[];
}

export interface MatchPoints {
  navy: number;
  red: number;
}

export interface Match {
  id: string;
  tournamentYear: number;
  sessionNumber: 1 | 2 | 3;
  format: MatchFormat;
  scoringType: ScoringType;
  status: MatchStatus;
  courseName?: string;
  teeTime?: string;
  navySide: MatchSide;
  redSide: MatchSide;
  frontNinePoints?: MatchPoints;
  backNinePoints?: MatchPoints;
  overallPoints?: MatchPoints;
  notes?: string;
}