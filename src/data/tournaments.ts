import tournamentsData from "./generated/tournaments.json";

import type {
  TeamId,
  Tournament,
  TournamentStatus,
  TournamentTeamScore,
} from "../types";

interface TournamentFeedRecord {
  tournament_id: string;
  year: number;
  name: string;
  venue: string;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  start_date: number | string;
  end_date: number | string;
  status: TournamentStatus;
  winning_team?: TeamId | null;
  navy_points?: number | null;
  red_points?: number | null;
  points_to_win: number;
  mvp_player_id?: string | null;
  summary?: string | null;
  full_write_up?: string | null;
  hero_image_key?: string | null;
  gallery_folder?: string | null;
  format_label?: string | null;
  content_status?: string | null;
}

function excelSerialToIsoDate(
  value: number | string,
): string {
  if (typeof value === "string") {
    return value;
  }

  /*
   * Excel's Windows date system starts at 1899-12-30.
   * Converting through UTC avoids local timezone shifts.
   */
  const excelEpoch = Date.UTC(1899, 11, 30);
  const millisecondsPerDay = 86_400_000;
  const date = new Date(
    excelEpoch + value * millisecondsPerDay,
  );

  return date.toISOString().slice(0, 10);
}

function isTeamId(
  value: unknown,
): value is TeamId {
  return value === "navy" || value === "red";
}

function buildTeamScores(
  record: TournamentFeedRecord,
): TournamentTeamScore[] {
  return [
    {
      teamId: "navy",
      points: record.navy_points ?? 0,
    },
    {
      teamId: "red",
      points: record.red_points ?? 0,
    },
  ];
}

function buildWinningScore(
  record: TournamentFeedRecord,
): string | undefined {
  if (!isTeamId(record.winning_team)) {
    return undefined;
  }

  const navyPoints = record.navy_points ?? 0;
  const redPoints = record.red_points ?? 0;

  return `${navyPoints} - ${redPoints}`;
}

function mapTournament(
  record: TournamentFeedRecord,
): Tournament {
  return {
    id: record.tournament_id,
    year: record.year,
    name: record.name,
    venue: record.venue,
    city: record.city ?? undefined,
    region: record.region ?? undefined,
    country: record.country ?? undefined,
    startDate: excelSerialToIsoDate(
      record.start_date,
    ),
    endDate: excelSerialToIsoDate(
      record.end_date,
    ),
    status: record.status,
    winningTeam: isTeamId(record.winning_team)
      ? record.winning_team
      : undefined,
    winningScore: buildWinningScore(record),
    pointsToWin: record.points_to_win,
    teamScores: buildTeamScores(record),
    sessionIds: [],
    mvpPlayerId:
      record.mvp_player_id ?? undefined,
    summary:
      record.full_write_up ??
      record.summary ??
      undefined,
    photoPaths: record.gallery_folder
      ? [record.gallery_folder]
      : undefined,
  };
}

export const tournaments: Tournament[] = (
  tournamentsData as TournamentFeedRecord[]
)
  .map(mapTournament)
  .sort((a, b) => a.year - b.year);

export function getTournamentByYear(
  year: number,
): Tournament | undefined {
  return tournaments.find(
    (tournament) => tournament.year === year,
  );
}

export function getTournamentById(
  tournamentId: string,
): Tournament | undefined {
  return tournaments.find(
    (tournament) =>
      tournament.id === tournamentId,
  );
}

export function getCurrentTournament():
  | Tournament
  | undefined {
  return [...tournaments]
    .sort((a, b) => b.year - a.year)
    .find(
      (tournament) =>
        tournament.status !== "complete",
    );
}

export function getCompletedTournaments():
  Tournament[] {
  return tournaments
    .filter(
      (tournament) =>
        tournament.status === "complete",
    )
    .sort((a, b) => b.year - a.year);
}