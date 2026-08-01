import type {
  MatchFormat,
  MatchHistoryRecord,
  MatchResult,
} from "../data/matchHistory";

import type {
  TeamId,
} from "../types";

export interface RecordSummary {
  played: number;
  wins: number;
  ties: number;
  losses: number;
  points: number;
  winPercentage: number;
  unbeatenPercentage: number;
}

export interface PlayerFormatStats
  extends RecordSummary {
  format: MatchFormat;
}

export interface PlayerYearStats
  extends RecordSummary {
  year: number;
}

export interface PlayerStreakStats {
  currentUnbeatenStreak: number;
  longestUnbeatenStreak: number;
  currentWinningStreak: number;
  longestWinningStreak: number;
}

export interface PartnerRecord
  extends RecordSummary {
  partnerId: string;
  partnerName?: string;
}

export interface SinglesOpponentRecord
  extends RecordSummary {
  opponentId: string;
  opponentName?: string;
}

export interface PlayerCareerStats
  extends RecordSummary,
    PlayerStreakStats {
  playerId: string;
  formats: PlayerFormatStats[];
  years: PlayerYearStats[];
  partnerRecords: PartnerRecord[];
  singlesOpponentRecords: SinglesOpponentRecord[];
}

export interface PlayerAnalyticsSource {
  playerId: string;
  matches: MatchHistoryRecord[];
}

export interface PartnerMatchSummary
  extends RecordSummary {
  playerId: string;
  partnerId: string;
  partnerName?: string;
  matchIds: string[];
  years: number[];
}

export interface PlayerPartnerAnalytics {
  playerId: string;
  partners: PartnerMatchSummary[];
  bestPartner?: PartnerMatchSummary;
  mostFrequentPartner?: PartnerMatchSummary;
}

export interface HeadToHeadFormatSummary
  extends RecordSummary {
  format: MatchFormat;
}

export interface HeadToHeadLastMatch {
  matchId: string;
  tournamentId: string;
  year: number;
  format: MatchFormat;
  result: MatchResult;
  pointsEarned: number;
  course?: string;
  scoreNotes?: string;
}

export interface HeadToHeadStreak {
  result: MatchResult;
  length: number;
}

export interface HeadToHeadOpponentSummary
  extends RecordSummary {
  playerId: string;
  opponentId: string;
  opponentName?: string;
  matchIds: string[];
  years: number[];
  formats: HeadToHeadFormatSummary[];
  singles: RecordSummary;
  lastMatch?: HeadToHeadLastMatch;
  currentStreak?: HeadToHeadStreak;
}

export interface PlayerHeadToHeadAnalytics {
  playerId: string;
  opponents: HeadToHeadOpponentSummary[];
  bestRecord?: HeadToHeadOpponentSummary;
  mostPlayedOpponent?: HeadToHeadOpponentSummary;
}

export interface PlayerFormMatch {
  matchId: string;
  tournamentId: string;
  year: number;
  format: MatchFormat;
  result: MatchResult;
  pointsEarned: number;
  course?: string;
  scoreNotes?: string;
}

export interface PlayerCurrentForm
  extends RecordSummary {
  matches: PlayerFormMatch[];
  formSequence: MatchResult[];
}

export interface PlayerSeasonSummary
  extends RecordSummary {
  year: number;
  formats: PlayerFormatStats[];
  matchIds: string[];
}

export interface PlayerTrendAnalytics {
  playerId: string;
  currentForm: PlayerCurrentForm;
  seasons: PlayerSeasonSummary[];
  bestSeason?: PlayerSeasonSummary;
  mostRecentSeason?: PlayerSeasonSummary;
  firstSeason?: PlayerSeasonSummary;
  seasonCount: number;
  careerPointsPerMatch: number;
  currentFormPointsPerMatch: number;
}

export interface PlayerRankingEntry {
  playerId: string;

  careerRank: number;
  formRank: number;
  powerRank: number;

  careerPoints: number;
  careerWins: number;
  careerMatches: number;
  careerWinPercentage: number;
  careerUnbeatenPercentage: number;

  currentFormPoints: number;
  currentFormWins: number;
  currentFormMatches: number;
  currentFormWinPercentage: number;
  currentFormUnbeatenPercentage: number;

  powerScore: number;
  momentum: number;
}

export interface PlayerRankings {
  playerIds: string[];
  career: PlayerRankingEntry[];
  currentForm: PlayerRankingEntry[];
  power: PlayerRankingEntry[];
}

export interface TeamMatchSummary {
  matchId: string;
  tournamentId: string;
  year: number;
  sessionId: string;
  format: MatchFormat;
  matchType: string;
  course: string;
  teamId: TeamId;
  result: MatchResult;
  pointsEarned: number;
  playerIds: string[];
  playerNames: string[];
  scoreNotes?: string;
}

export interface TeamFormatStats
  extends RecordSummary {
  format: MatchFormat;
}

export interface TeamYearStats
  extends RecordSummary {
  year: number;
  tournamentId: string;
  formats: TeamFormatStats[];
}

export interface TeamPlayerContribution {
  playerId: string;
  playerName: string;
  matches: number;
  wins: number;
  ties: number;
  losses: number;
  points: number;
  winPercentage: number;
}

export interface TeamAnalytics
  extends RecordSummary {
  teamId: TeamId;
  matchIds: string[];
  tournamentIds: string[];
  years: number[];
  formats: TeamFormatStats[];
  seasons: TeamYearStats[];
  playerContributions: TeamPlayerContribution[];
  bestSeason?: TeamYearStats;
  mostRecentSeason?: TeamYearStats;
  longestWinningStreak: number;
  longestUnbeatenStreak: number;
}

export interface TeamComparison {
  navy: TeamAnalytics;
  red: TeamAnalytics;
  pointsLeader?: TeamId;
  winsLeader?: TeamId;
  winPercentageLeader?: TeamId;
  currentOverallLeader?: TeamId;
  pointsDifference: number;
  winsDifference: number;
  winPercentageDifference: number;
}