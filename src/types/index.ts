export type TeamId = "navy" | "red";

export type TeamName = "Team Navy" | "Team Red";

export type MatchFormat =
  | "scramble"
  | "fourball"
  | "singles";

export type MatchStatus =
  | "scheduled"
  | "in-progress"
  | "complete"
  | "cancelled";

export type MatchResult =
  | "navy"
  | "red"
  | "halved"
  | null;

export type TournamentStatus =
  | "upcoming"
  | "in-progress"
  | "complete";

export interface Team {
  id: TeamId;
  name: TeamName;
  shortName: "Navy" | "Red";
  abbreviation: "NAV" | "RED";
  color: string;
  secondaryColor: string;
  logoPath: string;
}

export interface PlayerRecord {
  matchesPlayed: number;
  wins: number;
  losses: number;
  halves: number;
  pointsWon: number;
  pointsAvailable: number;
}

export interface PlayerFormatRecord extends PlayerRecord {
  format: MatchFormat;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  teamId: TeamId;
  handicap: number;
  hometown?: string;
  homeCourse?: string;
  favoriteDrink?: string;
  walkoutMusic?: string;
  photoPath?: string;
  bio?: string;
  funFacts?: string[];
  yearsPlayed: number[];
  overallRecord: PlayerRecord;
  formatRecords: PlayerFormatRecord[];
}

export interface MatchPlayer {
  playerId: string;
  teamId: TeamId;
}

export interface MatchScore {
  navyHolesWon: number;
  redHolesWon: number;
  holesRemaining: number;
  displayScore: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  sessionId: string;
  matchNumber: number;
  format: MatchFormat;
  status: MatchStatus;
  navyPlayers: MatchPlayer[];
  redPlayers: MatchPlayer[];
  startTime?: string;
  currentHole?: number;
  score?: MatchScore;
  result: MatchResult;
  resultText?: string;
  navyPoints: number;
  redPoints: number;
}

export interface TournamentSession {
  id: string;
  tournamentId: string;
  name: string;
  shortName: string;
  dayNumber: number;
  sessionNumber: number;
  format: MatchFormat;
  date: string;
  startTime?: string;
  matchIds: string[];
}

export interface TournamentTeamScore {
  teamId: TeamId;
  points: number;
}

export interface Tournament {
  id: string;
  year: number;
  name: string;
  venue: string;
  city?: string;
  region?: string;
  country?: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  defendingChampion?: TeamId;
  winningTeam?: TeamId;
  winningScore?: string;
  pointsToWin: number;
  teamScores: TournamentTeamScore[];
  sessionIds: string[];
  mvpPlayerId?: string;
  summary?: string;
  photoPaths?: string[];
}

export interface TournamentStanding {
  teamId: TeamId;
  points: number;
  matchesWon: number;
  matchesLost: number;
  matchesHalved: number;
  matchesRemaining: number;
  projectedPoints?: number;
}

export interface HistoricalResult {
  tournamentId: string;
  year: number;
  winningTeam: TeamId;
  finalScore: string;
  venue: string;
  mvpPlayerId?: string;
}

export interface TournamentRecord {
  id: string;
  title: string;
  description?: string;
  value: string | number;
  playerId?: string;
  teamId?: TeamId;
  tournamentId?: string;
  year?: number;
  category:
    | "player"
    | "team"
    | "match"
    | "scoring"
    | "tournament";
}