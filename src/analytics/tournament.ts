import tournamentData from "../data/generated/tournaments.json";

import {
  matchHistory,
  type MatchFormat,
  type MatchHistoryRecord,
  type MatchResult,
} from "../data/matchHistory";

import type {
  TeamId,
} from "../types";

import {
  roundPercentage,
} from "./utils";

interface TournamentFeedRow {
  tournament_id: string;
  year: number;
  venue: string;
  city: string;
  region: string;
  start_date: number | string;
  end_date: number | string;
  status: string;
  winning_team: TeamId | null;
  navy_points: number;
  red_points: number;
}

export interface TournamentRecordSummary {
  played: number;
  wins: number;
  ties: number;
  losses: number;
  points: number;
  winPercentage: number;
  unbeatenPercentage: number;
}

export interface TournamentFormatSummary
  extends TournamentRecordSummary {
  format: MatchFormat;
}

export interface TournamentTeamSummary
  extends TournamentRecordSummary {
  teamId: TeamId;
  formats: TournamentFormatSummary[];
}

export interface TournamentPlayerSummary
  extends TournamentRecordSummary {
  playerId: string;
  playerName: string;
  teamId: TeamId;
  formats: TournamentFormatSummary[];
}

export interface TournamentMatchSummary {
  matchId: string;
  tournamentId: string;
  year: number;
  sessionId: string;
  format: MatchFormat;
  matchType: string;
  course: string;
  navyResult: MatchResult;
  redResult: MatchResult;
  navyPoints: number;
  redPoints: number;
  navyPlayerIds: string[];
  navyPlayerNames: string[];
  redPlayerIds: string[];
  redPlayerNames: string[];
  scoreNotes?: string;
}

export interface TournamentAnalytics {
  tournamentId: string;
  year: number;
  venue: string;
  city: string;
  region: string;
  startDate: number | string;
  endDate: number | string;
  status: string;

  officialWinningTeam?: TeamId;
  calculatedWinningTeam?: TeamId;

  officialNavyPoints: number;
  officialRedPoints: number;

  calculatedNavyPoints: number;
  calculatedRedPoints: number;

  totalMatches: number;

  navy: TournamentTeamSummary;
  red: TournamentTeamSummary;

  playerLeaderboard: TournamentPlayerSummary[];
  matches: TournamentMatchSummary[];

  topPlayer?: TournamentPlayerSummary;
  closestMargin: number;
  isTie: boolean;
}

const tournaments =
  tournamentData as TournamentFeedRow[];

function summarizeRows(
  rows: Array<{
    result: MatchResult;
    points: number;
  }>,
): TournamentRecordSummary {
  const played = rows.length;

  const wins = rows.filter(
    (row) => row.result === "W",
  ).length;

  const ties = rows.filter(
    (row) => row.result === "T",
  ).length;

  const losses = rows.filter(
    (row) => row.result === "L",
  ).length;

  const points = rows.reduce(
    (total, row) =>
      total + row.points,
    0,
  );

  return {
    played,
    wins,
    ties,
    losses,
    points,

    winPercentage:
      played === 0
        ? 0
        : roundPercentage(
            ((wins + ties * 0.5) /
              played) *
              100,
          ),

    unbeatenPercentage:
      played === 0
        ? 0
        : roundPercentage(
            ((wins + ties) /
              played) *
              100,
          ),
  };
}

function uniqueValues(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values.filter(Boolean),
    ),
  );
}

function getTournamentRecords(
  tournamentId: string,
): MatchHistoryRecord[] {
  return matchHistory.filter(
    (record) =>
      record.tournament_id ===
      tournamentId,
  );
}

function buildMatchSummaries(
  tournamentId: string,
): TournamentMatchSummary[] {
  const records =
    getTournamentRecords(
      tournamentId,
    );

  const matchMap = new Map<
    string,
    MatchHistoryRecord[]
  >();

  for (const record of records) {
    const existing =
      matchMap.get(
        record.match_id,
      );

    if (existing) {
      existing.push(record);
    } else {
      matchMap.set(
        record.match_id,
        [record],
      );
    }
  }

  return Array.from(
    matchMap.values(),
  )
    .map(
      (
        matchRecords,
      ): TournamentMatchSummary => {
        const first =
          matchRecords[0];

        const navyRows =
          matchRecords.filter(
            (record) =>
              record.team_id ===
              "navy",
          );

        const redRows =
          matchRecords.filter(
            (record) =>
              record.team_id ===
              "red",
          );

        const navyFirst =
          navyRows[0];

        const redFirst =
          redRows[0];

        return {
          matchId:
            first.match_id,

          tournamentId:
            first.tournament_id,

          year:
            first.year,

          sessionId:
            first.session_id,

          format:
            first.format,

          matchType:
            first.match_type,

          course:
            first.course,

          navyResult:
            navyFirst?.result ??
            invertResult(
              redFirst?.result ?? "T",
            ),

          redResult:
            redFirst?.result ??
            invertResult(
              navyFirst?.result ?? "T",
            ),

          navyPoints:
            navyFirst?.points_earned ??
            0,

          redPoints:
            redFirst?.points_earned ??
            0,

          navyPlayerIds:
            uniqueValues(
              navyRows.map(
                (record) =>
                  record.player_id,
              ),
            ),

          navyPlayerNames:
            uniqueValues(
              navyRows.map(
                (record) =>
                  record.player_name,
              ),
            ),

          redPlayerIds:
            uniqueValues(
              redRows.map(
                (record) =>
                  record.player_id,
              ),
            ),

          redPlayerNames:
            uniqueValues(
              redRows.map(
                (record) =>
                  record.player_name,
              ),
            ),

          scoreNotes:
            first.score_notes?.trim() ||
            undefined,
        };
      },
    )
    .sort((a, b) => {
      if (
        a.year !== b.year
      ) {
        return (
          a.year - b.year
        );
      }

      if (
        a.sessionId !==
        b.sessionId
      ) {
        return a.sessionId.localeCompare(
          b.sessionId,
        );
      }

      return a.matchId.localeCompare(
        b.matchId,
      );
    });
}

function invertResult(
  result: MatchResult,
): MatchResult {
  if (result === "W") {
    return "L";
  }

  if (result === "L") {
    return "W";
  }

  return "T";
}

function buildFormatSummaries(
  rows: Array<{
    format: MatchFormat;
    result: MatchResult;
    points: number;
  }>,
): TournamentFormatSummary[] {
  const formats =
    Array.from(
      new Set(
        rows.map(
          (row) => row.format,
        ),
      ),
    );

  return formats
    .map(
      (
        format,
      ): TournamentFormatSummary => ({
        format,

        ...summarizeRows(
          rows
            .filter(
              (row) =>
                row.format ===
                format,
            )
            .map((row) => ({
              result: row.result,
              points: row.points,
            })),
        ),
      }),
    )
    .sort((a, b) =>
      a.format.localeCompare(
        b.format,
      ),
    );
}

function buildTeamSummary(
  teamId: TeamId,
  matches: TournamentMatchSummary[],
): TournamentTeamSummary {
  const rows =
    matches.map((match) => ({
      format:
        match.format,

      result:
        teamId === "navy"
          ? match.navyResult
          : match.redResult,

      points:
        teamId === "navy"
          ? match.navyPoints
          : match.redPoints,
    }));

  return {
    teamId,

    formats:
      buildFormatSummaries(rows),

    ...summarizeRows(rows),
  };
}

function buildPlayerLeaderboard(
  tournamentId: string,
): TournamentPlayerSummary[] {
  const records =
    getTournamentRecords(
      tournamentId,
    );

  const playerMap = new Map<
    string,
    MatchHistoryRecord[]
  >();

  for (const record of records) {
    const existing =
      playerMap.get(
        record.player_id,
      );

    if (existing) {
      existing.push(record);
    } else {
      playerMap.set(
        record.player_id,
        [record],
      );
    }
  }

  return Array.from(
    playerMap.entries(),
  )
    .map(
      ([
        playerId,
        playerRecords,
      ]): TournamentPlayerSummary => {
        const first =
          playerRecords[0];

        const rows =
          playerRecords.map(
            (record) => ({
              format:
                record.format,

              result:
                record.result,

              points:
                record.points_earned,
            }),
          );

        return {
          playerId,

          playerName:
            first.player_name,

          teamId:
            first.team_id,

          formats:
            buildFormatSummaries(
              rows,
            ),

          ...summarizeRows(rows),
        };
      },
    )
    .sort((a, b) => {
      if (
        b.points !== a.points
      ) {
        return (
          b.points - a.points
        );
      }

      if (
        b.winPercentage !==
        a.winPercentage
      ) {
        return (
          b.winPercentage -
          a.winPercentage
        );
      }

      if (
        b.wins !== a.wins
      ) {
        return (
          b.wins - a.wins
        );
      }

      return a.playerName.localeCompare(
        b.playerName,
      );
    });
}

function determineWinner(
  navyPoints: number,
  redPoints: number,
): TeamId | undefined {
  if (
    navyPoints === redPoints
  ) {
    return undefined;
  }

  return navyPoints > redPoints
    ? "navy"
    : "red";
}

export function getTournamentAnalytics(
  tournamentId: string,
): TournamentAnalytics | undefined {
  const tournament =
    tournaments.find(
      (item) =>
        item.tournament_id ===
        tournamentId,
    );

  if (!tournament) {
    return undefined;
  }

  const matches =
    buildMatchSummaries(
      tournamentId,
    );

  const navy =
    buildTeamSummary(
      "navy",
      matches,
    );

  const red =
    buildTeamSummary(
      "red",
      matches,
    );

  const playerLeaderboard =
    buildPlayerLeaderboard(
      tournamentId,
    );

  const calculatedWinningTeam =
    determineWinner(
      navy.points,
      red.points,
    );

  return {
    tournamentId:
      tournament.tournament_id,

    year:
      tournament.year,

    venue:
      tournament.venue,

    city:
      tournament.city,

    region:
      tournament.region,

    startDate:
      tournament.start_date,

    endDate:
      tournament.end_date,

    status:
      tournament.status,

    officialWinningTeam:
      tournament.winning_team ??
      undefined,

    calculatedWinningTeam,

    officialNavyPoints:
      tournament.navy_points,

    officialRedPoints:
      tournament.red_points,

    calculatedNavyPoints:
      navy.points,

    calculatedRedPoints:
      red.points,

    totalMatches:
      matches.length,

    navy,
    red,

    playerLeaderboard,

    matches,

    topPlayer:
      playerLeaderboard[0],

    closestMargin:
      roundPercentage(
        Math.abs(
          tournament.navy_points -
            tournament.red_points,
        ),
      ),

    isTie:
      tournament.navy_points ===
      tournament.red_points,
  };
}

export function getTournamentAnalyticsByYear(
  year: number,
): TournamentAnalytics | undefined {
  const tournament =
    tournaments.find(
      (item) =>
        item.year === year,
    );

  if (!tournament) {
    return undefined;
  }

  return getTournamentAnalytics(
    tournament.tournament_id,
  );
}

export function getAllTournamentAnalytics(): TournamentAnalytics[] {
  return tournaments
    .map((tournament) =>
      getTournamentAnalytics(
        tournament.tournament_id,
      ),
    )
    .filter(
      (
        tournament,
      ): tournament is TournamentAnalytics =>
        Boolean(tournament),
    )
    .sort(
      (a, b) =>
        a.year - b.year,
    );
}

export function getCompletedTournamentAnalytics(): TournamentAnalytics[] {
  return getAllTournamentAnalytics().filter(
    (tournament) =>
      tournament.status ===
      "complete",
  );
}

export function getLatestCompletedTournamentAnalytics():
  | TournamentAnalytics
  | undefined {
  return getCompletedTournamentAnalytics()
    .slice()
    .sort(
      (a, b) =>
        b.year - a.year,
    )[0];
}