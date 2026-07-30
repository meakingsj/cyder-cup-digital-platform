import generatedHistory from "./generated/history.json";
import generatedTournaments from "./generated/tournaments.json";
import type { TeamId, TournamentStatus } from "../types";

export interface HistoryEntry {
  year: number;
  title: string;
  overview: string;
  writeup: string[];
  photos: string[];
}

export interface TournamentFeedRow {
  tournament_id: string;
  year: number;
  name: string;
  venue: string;
  city?: string;
  region?: string;
  country?: string;
  start_date: number | string;
  end_date: number | string;
  status: TournamentStatus;
  winning_team?: TeamId | null;
  navy_points: number;
  red_points: number;
  points_to_win: number;
  "winning captain"?: string | null;
  summary?: string;
}

export const historyEntries = generatedHistory as HistoryEntry[];
export const tournamentFeed = generatedTournaments as TournamentFeedRow[];

export function getHistoryEntry(year: number): HistoryEntry | undefined {
  return historyEntries.find((entry) => entry.year === year);
}

export function getTournamentFeedRow(year: number): TournamentFeedRow | undefined {
  return tournamentFeed.find((tournament) => tournament.year === year);
}

export function excelSerialToDate(value: number | string): Date | undefined {
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  if (!Number.isFinite(value)) return undefined;
  return new Date(Date.UTC(1899, 11, 30) + value * 86_400_000);
}

export function formatTournamentDates(start: number | string, end: number | string): string {
  const startDate = excelSerialToDate(start);
  const endDate = excelSerialToDate(end);
  if (!startDate || !endDate) return "Dates to be confirmed";

  const startMonth = startDate.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const year = endDate.getUTCFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getUTCDate()}–${endDate.getUTCDate()}, ${year}`;
  }

  return `${startMonth} ${startDate.getUTCDate()} – ${endMonth} ${endDate.getUTCDate()}, ${year}`;
}
