import {
  matchHistory,
  type MatchFormat,
  type MatchHistoryRecord,
  type MatchResult,
} from "../data/matchHistory";

import type {
  TeamId,
} from "../types";

import type {
  RecordSummary,
  TeamAnalytics,
  TeamComparison,
  TeamFormatStats,
  TeamMatchSummary,
  TeamPlayerContribution,
  TeamYearStats,
} from "./types";

import {
  roundPercentage,
} from "./utils";

function summarizeTeamMatches(
  matches: TeamMatchSummary[],
): RecordSummary {
  const wins = matches.filter(
    (match) => match.result === "W",
  ).length;

  const ties = matches.filter(
    (match) => match.result === "T",
  ).length;

  const losses = matches.filter(
    (match) => match.result === "L",
  ).length;

  const played = matches.length;

  const points = matches.reduce(
    (total, match) =>
      total + match.pointsEarned,
    0,
  );

  const winPercentage =
    played === 0
      ? 0
      : roundPercentage(
          ((wins + ties * 0.5) /
            played) *
            100,
        );

  const unbeatenPercentage =
    played === 0
      ? 0
      : roundPercentage(
          ((wins + ties) /
            played) *
            100,
        );

  return {
    played,
    wins,
    ties,
    losses,
    points,
    winPercentage,
    unbeatenPercentage,
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

function buildTeamMatchKey(
  record: MatchHistoryRecord,
): string {
  return `${record.match_id}::${record.team_id}`;
}

function buildTeamMatches(
  teamId?: TeamId,
): TeamMatchSummary[] {
  const grouped = new Map<
    string,
    MatchHistoryRecord[]
  >();

  for (const record of matchHistory) {
    if (
      teamId &&
      record.team_id !== teamId
    ) {
      continue;
    }

    const key =
      buildTeamMatchKey(record);

    const existing =
      grouped.get(key);

    if (existing) {
      existing.push(record);
    } else {
      grouped.set(key, [record]);
    }
  }

  return Array.from(
    grouped.values(),
  )
    .map(
      (
        records,
      ): TeamMatchSummary => {
        const first = records[0];

        return {
          matchId: first.match_id,
          tournamentId:
            first.tournament_id,
          year: first.year,
          sessionId:
            first.session_id,
          format: first.format,
          matchType:
            first.match_type,
          course: first.course,
          teamId: first.team_id,
          result: first.result,

          /*
           * Each player row carries the same
           * team-match result and point value.
           * We use one row per team per match
           * so multi-player formats are not
           * counted multiple times.
           */
          pointsEarned:
            first.points_earned,

          playerIds:
            uniqueValues(
              records.map(
                (record) =>
                  record.player_id,
              ),
            ),

          playerNames:
            uniqueValues(
              records.map(
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
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      if (
        a.tournamentId !==
        b.tournamentId
      ) {
        return a.tournamentId.localeCompare(
          b.tournamentId,
        );
      }

      return a.matchId.localeCompare(
        b.matchId,
      );
    });
}

function buildFormatStats(
  matches: TeamMatchSummary[],
): TeamFormatStats[] {
  const formats =
    Array.from(
      new Set(
        matches.map(
          (match) => match.format,
        ),
      ),
    );

  return formats
    .map(
      (
        format,
      ): TeamFormatStats => ({
        format,
        ...summarizeTeamMatches(
          matches.filter(
            (match) =>
              match.format === format,
          ),
        ),
      }),
    )
    .sort((a, b) =>
      a.format.localeCompare(
        b.format,
      ),
    );
}

function buildSeasonStats(
  matches: TeamMatchSummary[],
): TeamYearStats[] {
  const seasonMap = new Map<
    string,
    TeamMatchSummary[]
  >();

  for (const match of matches) {
    const key =
      `${match.year}::${match.tournamentId}`;

    const existing =
      seasonMap.get(key);

    if (existing) {
      existing.push(match);
    } else {
      seasonMap.set(key, [match]);
    }
  }

  return Array.from(
    seasonMap.values(),
  )
    .map(
      (
        seasonMatches,
      ): TeamYearStats => ({
        year:
          seasonMatches[0].year,

        tournamentId:
          seasonMatches[0]
            .tournamentId,

        formats:
          buildFormatStats(
            seasonMatches,
          ),

        ...summarizeTeamMatches(
          seasonMatches,
        ),
      }),
    )
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return a.tournamentId.localeCompare(
        b.tournamentId,
      );
    });
}

function compareBestSeason(
  a: TeamYearStats,
  b: TeamYearStats,
): number {
  if (b.points !== a.points) {
    return b.points - a.points;
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

  if (b.wins !== a.wins) {
    return b.wins - a.wins;
  }

  return b.year - a.year;
}

function calculateLongestStreak(
  matches: TeamMatchSummary[],
  qualifies: (
    result: MatchResult,
  ) => boolean,
): number {
  let current = 0;
  let longest = 0;

  for (const match of matches) {
    if (qualifies(match.result)) {
      current += 1;
      longest = Math.max(
        longest,
        current,
      );
    } else {
      current = 0;
    }
  }

  return longest;
}

function buildPlayerContributions(
  teamId: TeamId,
): TeamPlayerContribution[] {
  const playerRecords =
    matchHistory.filter(
      (record) =>
        record.team_id === teamId,
    );

  const playerMap = new Map<
    string,
    MatchHistoryRecord[]
  >();

  for (const record of playerRecords) {
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
        records,
      ]): TeamPlayerContribution => {
        const wins =
          records.filter(
            (record) =>
              record.result === "W",
          ).length;

        const ties =
          records.filter(
            (record) =>
              record.result === "T",
          ).length;

        const losses =
          records.filter(
            (record) =>
              record.result === "L",
          ).length;

        const matches =
          records.length;

        const points =
          records.reduce(
            (total, record) =>
              total +
              record.points_earned,
            0,
          );

        return {
          playerId,
          playerName:
            records[0]
              .player_name,
          matches,
          wins,
          ties,
          losses,
          points,
          winPercentage:
            matches === 0
              ? 0
              : roundPercentage(
                  ((wins +
                    ties * 0.5) /
                    matches) *
                    100,
                ),
        };
      },
    )
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
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

      return a.playerName.localeCompare(
        b.playerName,
      );
    });
}

export function getTeamAnalytics(
  teamId: TeamId,
): TeamAnalytics {
  const matches =
    buildTeamMatches(teamId);

  const seasons =
    buildSeasonStats(matches);

  const bestSeason =
    [...seasons].sort(
      compareBestSeason,
    )[0];

  const mostRecentSeason =
    seasons[
      seasons.length - 1
    ];

  return {
    teamId,

    matchIds:
      matches.map(
        (match) => match.matchId,
      ),

    tournamentIds:
      Array.from(
        new Set(
          matches.map(
            (match) =>
              match.tournamentId,
          ),
        ),
      ),

    years:
      Array.from(
        new Set(
          matches.map(
            (match) => match.year,
          ),
        ),
      ).sort((a, b) => a - b),

    formats:
      buildFormatStats(matches),

    seasons,

    playerContributions:
      buildPlayerContributions(
        teamId,
      ),

    bestSeason,
    mostRecentSeason,

    longestWinningStreak:
      calculateLongestStreak(
        matches,
        (result) =>
          result === "W",
      ),

    longestUnbeatenStreak:
      calculateLongestStreak(
        matches,
        (result) =>
          result !== "L",
      ),

    ...summarizeTeamMatches(
      matches,
    ),
  };
}

function determineLeader(
  navyValue: number,
  redValue: number,
): TeamId | undefined {
  if (navyValue === redValue) {
    return undefined;
  }

  return navyValue > redValue
    ? "navy"
    : "red";
}

export function getTeamComparison(): TeamComparison {
  const navy =
    getTeamAnalytics("navy");

  const red =
    getTeamAnalytics("red");

  const pointsLeader =
    determineLeader(
      navy.points,
      red.points,
    );

  const winsLeader =
    determineLeader(
      navy.wins,
      red.wins,
    );

  const winPercentageLeader =
    determineLeader(
      navy.winPercentage,
      red.winPercentage,
    );

  const mostRecentYear =
    Math.max(
      navy.mostRecentSeason?.year ??
        0,
      red.mostRecentSeason?.year ??
        0,
    );

  const navyRecent =
    navy.seasons.find(
      (season) =>
        season.year ===
        mostRecentYear,
    );

  const redRecent =
    red.seasons.find(
      (season) =>
        season.year ===
        mostRecentYear,
    );

  const currentOverallLeader =
    determineLeader(
      navyRecent?.points ?? 0,
      redRecent?.points ?? 0,
    );

  return {
    navy,
    red,
    pointsLeader,
    winsLeader,
    winPercentageLeader,
    currentOverallLeader,

    pointsDifference:
      roundPercentage(
        Math.abs(
          navy.points -
            red.points,
        ),
      ),

    winsDifference:
      Math.abs(
        navy.wins -
          red.wins,
      ),

    winPercentageDifference:
      roundPercentage(
        Math.abs(
          navy.winPercentage -
            red.winPercentage,
        ),
      ),
  };
}

export function getTeamFormatStats(
  teamId: TeamId,
  format: MatchFormat,
): TeamFormatStats {
  const existing =
    getTeamAnalytics(
      teamId,
    ).formats.find(
      (item) =>
        item.format === format,
    );

  if (existing) {
    return existing;
  }

  return {
    format,
    played: 0,
    wins: 0,
    ties: 0,
    losses: 0,
    points: 0,
    winPercentage: 0,
    unbeatenPercentage: 0,
  };
}

export function getTeamSeasonStats(
  teamId: TeamId,
  year: number,
): TeamYearStats | undefined {
  return getTeamAnalytics(
    teamId,
  ).seasons.find(
    (season) =>
      season.year === year,
  );
}

export function getTeamMatches(
  teamId: TeamId,
): TeamMatchSummary[] {
  return buildTeamMatches(
    teamId,
  );
}