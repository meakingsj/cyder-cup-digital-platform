import type { Match } from "./Match";
import type { TeamId } from "./Team";

export interface Venue {
  name: string;
  city: string;
  region: string;
  country: string;
  courseNames?: string[];
  websiteUrl?: string;
}

export interface TournamentScore {
  navy: number;
  red: number;
}

export interface TournamentAward {
  id: string;
  title: string;
  recipientPlayerId?: string;
  recipientTeamId?: TeamId;
  description?: string;
}

export interface TournamentPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Tournament {
  year: number;
  name: string;
  startDate?: string;
  endDate?: string;
  venue: Venue;
  winningTeam?: TeamId;
  finalScore?: TournamentScore;
  playerIds: string[];
  matches: Match[];
  awards: TournamentAward[];
  photos: TournamentPhoto[];
  summary?: string;
  isComplete: boolean;
}