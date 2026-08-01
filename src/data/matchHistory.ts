import matchHistoryData from "./generated/match-history.json";

import type { TeamId } from "../types";

export type MatchResult = "W" | "T" | "L";

export type MatchFormat =
  | "Singles"
  | "Fourball"
  | "Scramble"
  | "4-man Scramble";

export interface MatchHistoryRecord {
  match_id: string;
  tournament_id: string;
  year: number;
  session_id: string;
  format: MatchFormat;
  match_type: string;
  course: string;

  player_id: string;
  player_name: string;
  team_id: TeamId;

  partner_player_ids?: string | null;
  partner_names?: string | null;

  opponent_1_id?: string | null;
  opponent_1_name?: string | null;
  opponent_2_id?: string | null;
  opponent_2_name?: string | null;

  result: MatchResult;
  points_earned: number;

  score_notes?: string | null;
  source_record_book_row: number;
}

export const matchHistory =
  matchHistoryData as MatchHistoryRecord[];

export function getMatchHistoryByPlayer(
  playerId: string,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) => record.player_id === playerId,
  );
}

export function getMatchHistoryByMatch(
  matchId: string,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) => record.match_id === matchId,
  );
}

export function getMatchHistoryByTournament(
  tournamentId: string,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) =>
      record.tournament_id === tournamentId,
  );
}

export function getMatchHistoryByYear(
  year: number,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) => record.year === year,
  );
}

export function getMatchHistoryByFormat(
  format: MatchFormat,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) => record.format === format,
  );
}