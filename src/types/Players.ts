import type { TeamId } from "./Team";

export interface PlayerCareerRecord {
  appearances: number;
  pointsEarned: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  halves: number;
}

export interface FormatRecord {
  played: number;
  wins: number;
  losses: number;
  halves: number;
  pointsEarned: number;
}

export interface PlayerStatistics {
  overall: PlayerCareerRecord;
  singles: FormatRecord;
  fourBall: FormatRecord;
  scramble: FormatRecord;
  longestUnbeatenStreak: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  team: TeamId;
  hometown?: string;
  biography?: string;
  profileImage?: string;
  debutYear: number;
  isActive: boolean;
  statistics?: PlayerStatistics;
}