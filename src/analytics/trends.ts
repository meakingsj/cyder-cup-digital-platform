import {
  getMatchHistoryByPlayer,
  type MatchHistoryRecord,
} from "../data/matchHistory";

import type {
  PlayerCurrentForm,
  PlayerFormMatch,
  PlayerFormatStats,
  PlayerSeasonSummary,
  PlayerTrendAnalytics,
} from "./types";

import {
  getUniqueMatchIds,
  roundPercentage,
  sortChronologically,
  summarizeRecords,
} from "./utils";

const CURRENT_FORM_MATCH_COUNT = 5;

function buildFormMatch(
  record: MatchHistoryRecord,
): PlayerFormMatch {
  return {
    matchId: record.match_id,
    tournamentId: record.tournament_id,
    year: record.year,
    format: record.format,
    result: record.result,
    pointsEarned: record.points_earned,
    course:
      record.course?.trim() ||
      undefined,
    scoreNotes:
      record.score_notes?.trim() ||
      undefined,
  };
}

function buildCurrentForm(
  records: MatchHistoryRecord[],
): PlayerCurrentForm {
  const chronologicalRecords =
    sortChronologically(records);

  const recentRecords =
    chronologicalRecords.slice(
      -CURRENT_FORM_MATCH_COUNT,
    );

  return {
    matches:
      recentRecords.map(buildFormMatch),

    formSequence:
      recentRecords.map(
        (record) => record.result,
      ),

    ...summarizeRecords(recentRecords),
  };
}

function buildFormatStats(
  records: MatchHistoryRecord[],
): PlayerFormatStats[] {
  const formats = Array.from(
    new Set(
      records.map(
        (record) => record.format,
      ),
    ),
  );

  return formats
    .map(
      (
        format,
      ): PlayerFormatStats => ({
        format,
        ...summarizeRecords(
          records.filter(
            (record) =>
              record.format === format,
          ),
        ),
      }),
    )
    .sort((a, b) =>
      a.format.localeCompare(b.format),
    );
}

function buildSeasonSummary(
  year: number,
  records: MatchHistoryRecord[],
): PlayerSeasonSummary {
  return {
    year,
    formats:
      buildFormatStats(records),
    matchIds:
      getUniqueMatchIds(records),
    ...summarizeRecords(records),
  };
}

function buildSeasonSummaries(
  records: MatchHistoryRecord[],
): PlayerSeasonSummary[] {
  const years = Array.from(
    new Set(
      records.map(
        (record) => record.year,
      ),
    ),
  ).sort((a, b) => a - b);

  return years.map((year) =>
    buildSeasonSummary(
      year,
      records.filter(
        (record) =>
          record.year === year,
      ),
    ),
  );
}

function compareBestSeason(
  a: PlayerSeasonSummary,
  b: PlayerSeasonSummary,
): number {
  if (
    b.winPercentage !==
    a.winPercentage
  ) {
    return (
      b.winPercentage -
      a.winPercentage
    );
  }

  if (b.points !== a.points) {
    return b.points - a.points;
  }

  if (b.wins !== a.wins) {
    return b.wins - a.wins;
  }

  if (b.played !== a.played) {
    return b.played - a.played;
  }

  return b.year - a.year;
}

function calculatePointsPerMatch(
  records: MatchHistoryRecord[],
): number {
  if (records.length === 0) {
    return 0;
  }

  const totalPoints =
    records.reduce(
      (total, record) =>
        total + record.points_earned,
      0,
    );

  return roundPercentage(
    totalPoints / records.length,
  );
}

export function getPlayerTrendAnalytics(
  playerId: string,
): PlayerTrendAnalytics {
  const records =
    getMatchHistoryByPlayer(playerId);

  const currentForm =
    buildCurrentForm(records);

  const seasons =
    buildSeasonSummaries(records);

  const bestSeason = [...seasons]
    .filter(
      (season) =>
        season.played > 0,
    )
    .sort(compareBestSeason)[0];

  const firstSeason =
    seasons[0];

  const mostRecentSeason =
    seasons[
      seasons.length - 1
    ];

  const currentFormRecords =
    sortChronologically(
      records,
    ).slice(
      -CURRENT_FORM_MATCH_COUNT,
    );

  return {
    playerId,
    currentForm,
    seasons,
    bestSeason,
    mostRecentSeason,
    firstSeason,
    seasonCount:
      seasons.length,

    careerPointsPerMatch:
      calculatePointsPerMatch(
        records,
      ),

    currentFormPointsPerMatch:
      calculatePointsPerMatch(
        currentFormRecords,
      ),
  };
}

export function getPlayerCurrentForm(
  playerId: string,
): PlayerCurrentForm {
  return getPlayerTrendAnalytics(
    playerId,
  ).currentForm;
}

export function getPlayerSeasonSummary(
  playerId: string,
  year: number,
): PlayerSeasonSummary | undefined {
  return getPlayerTrendAnalytics(
    playerId,
  ).seasons.find(
    (season) =>
      season.year === year,
  );
}

export function getPlayerBestSeason(
  playerId: string,
): PlayerSeasonSummary | undefined {
  return getPlayerTrendAnalytics(
    playerId,
  ).bestSeason;
}