import type { MatchFormat } from "../data/matchHistory";

import type {
  PlayerFormatStats,
} from "./types";

import {
  getPlayerCareerStats,
} from "./player";

import {
  getPlayerTrendAnalytics,
} from "./trends";

export type RecordMetric =
  | "career-points"
  | "career-wins"
  | "career-win-percentage"
  | "longest-unbeaten-streak"
  | "singles-points"
  | "fourball-points"
  | "scramble-points"
  | "best-season-points";

export interface RecordBookEntry {
  playerId: string;
  rank: number;
  value: number;
  displayValue: string;
  played?: number;
  wins?: number;
  ties?: number;
  losses?: number;
  winPercentage?: number;
  year?: number;
  format?: MatchFormat;
}

export interface RecordCategory {
  id: RecordMetric;
  title: string;
  description: string;
  entries: RecordBookEntry[];
  leader?: RecordBookEntry;
}

export interface SiteRecordBook {
  playerIds: string[];

  careerPoints: RecordCategory;
  careerWins: RecordCategory;
  careerWinPercentage: RecordCategory;
  longestUnbeatenStreak: RecordCategory;

  singlesPoints: RecordCategory;
  fourballPoints: RecordCategory;
  scramblePoints: RecordCategory;

  bestSeasonPoints: RecordCategory;

  categories: RecordCategory[];
}

interface UnrankedEntry
  extends Omit<
    RecordBookEntry,
    "rank"
  > {}

const MINIMUM_MATCHES_FOR_WIN_PERCENTAGE = 5;

function formatPoints(
  value: number,
): string {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
}

function formatPercentage(
  value: number,
): string {
  return `${value}%`;
}

function formatRecord(
  entry: {
    wins?: number;
    losses?: number;
    ties?: number;
  },
): string {
  return `${entry.wins ?? 0}-${entry.losses ?? 0}-${entry.ties ?? 0}`;
}

function getFormatStats(
  playerId: string,
  format: MatchFormat,
): PlayerFormatStats {
  const career =
    getPlayerCareerStats(playerId);

  const existing =
    career.formats.find(
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

function assignRanks(
  entries: UnrankedEntry[],
  compare: (
    a: UnrankedEntry,
    b: UnrankedEntry,
  ) => number,
): RecordBookEntry[] {
  const sorted =
    [...entries].sort(compare);

  let previousValue:
    | number
    | undefined;

  let previousRank = 0;

  return sorted.map(
    (
      entry,
      index,
    ): RecordBookEntry => {
      const rank =
        previousValue !== undefined &&
        entry.value === previousValue
          ? previousRank
          : index + 1;

      previousValue =
        entry.value;

      previousRank = rank;

      return {
        ...entry,
        rank,
      };
    },
  );
}

function compareByValue(
  a: UnrankedEntry,
  b: UnrankedEntry,
): number {
  if (b.value !== a.value) {
    return b.value - a.value;
  }

  if (
    (b.played ?? 0) !==
    (a.played ?? 0)
  ) {
    return (
      (b.played ?? 0) -
      (a.played ?? 0)
    );
  }

  return a.playerId.localeCompare(
    b.playerId,
  );
}

function comparePercentage(
  a: UnrankedEntry,
  b: UnrankedEntry,
): number {
  if (b.value !== a.value) {
    return b.value - a.value;
  }

  if (
    (b.played ?? 0) !==
    (a.played ?? 0)
  ) {
    return (
      (b.played ?? 0) -
      (a.played ?? 0)
    );
  }

  if (
    (b.wins ?? 0) !==
    (a.wins ?? 0)
  ) {
    return (
      (b.wins ?? 0) -
      (a.wins ?? 0)
    );
  }

  return a.playerId.localeCompare(
    b.playerId,
  );
}

function createCategory(
  id: RecordMetric,
  title: string,
  description: string,
  entries: RecordBookEntry[],
): RecordCategory {
  return {
    id,
    title,
    description,
    entries,
    leader: entries[0],
  };
}

function buildCareerPoints(
  playerIds: string[],
): RecordCategory {
  const entries = assignRanks(
    playerIds.map(
      (
        playerId,
      ): UnrankedEntry => {
        const stats =
          getPlayerCareerStats(
            playerId,
          );

        return {
          playerId,
          value: stats.points,
          displayValue:
            formatPoints(
              stats.points,
            ),
          played: stats.played,
          wins: stats.wins,
          ties: stats.ties,
          losses: stats.losses,
          winPercentage:
            stats.winPercentage,
        };
      },
    ),
    compareByValue,
  );

  return createCategory(
    "career-points",
    "Career Points",
    "Most individual points earned across all completed Cyder Cup matches.",
    entries,
  );
}

function buildCareerWins(
  playerIds: string[],
): RecordCategory {
  const entries = assignRanks(
    playerIds.map(
      (
        playerId,
      ): UnrankedEntry => {
        const stats =
          getPlayerCareerStats(
            playerId,
          );

        return {
          playerId,
          value: stats.wins,
          displayValue:
            stats.wins.toString(),
          played: stats.played,
          wins: stats.wins,
          ties: stats.ties,
          losses: stats.losses,
          winPercentage:
            stats.winPercentage,
        };
      },
    ),
    compareByValue,
  );

  return createCategory(
    "career-wins",
    "Career Wins",
    "Most individual match victories in Cyder Cup history.",
    entries,
  );
}

function buildCareerWinPercentage(
  playerIds: string[],
): RecordCategory {
  const eligiblePlayers =
    playerIds.filter(
      (playerId) =>
        getPlayerCareerStats(
          playerId,
        ).played >=
        MINIMUM_MATCHES_FOR_WIN_PERCENTAGE,
    );

  const entries = assignRanks(
    eligiblePlayers.map(
      (
        playerId,
      ): UnrankedEntry => {
        const stats =
          getPlayerCareerStats(
            playerId,
          );

        return {
          playerId,
          value:
            stats.winPercentage,
          displayValue:
            formatPercentage(
              stats.winPercentage,
            ),
          played: stats.played,
          wins: stats.wins,
          ties: stats.ties,
          losses: stats.losses,
          winPercentage:
            stats.winPercentage,
        };
      },
    ),
    comparePercentage,
  );

  return createCategory(
    "career-win-percentage",
    "Career Win Percentage",
    `Highest career win percentage among players with at least ${MINIMUM_MATCHES_FOR_WIN_PERCENTAGE} completed matches.`,
    entries,
  );
}

function buildLongestUnbeatenStreak(
  playerIds: string[],
): RecordCategory {
  const entries = assignRanks(
    playerIds.map(
      (
        playerId,
      ): UnrankedEntry => {
        const stats =
          getPlayerCareerStats(
            playerId,
          );

        return {
          playerId,
          value:
            stats.longestUnbeatenStreak,
          displayValue:
            stats.longestUnbeatenStreak.toString(),
          played: stats.played,
          wins: stats.wins,
          ties: stats.ties,
          losses: stats.losses,
          winPercentage:
            stats.winPercentage,
        };
      },
    ),
    compareByValue,
  );

  return createCategory(
    "longest-unbeaten-streak",
    "Longest Unbeaten Streak",
    "Most consecutive matches completed without a loss.",
    entries,
  );
}

function buildFormatPointsCategory(
  playerIds: string[],
  format: MatchFormat,
  id: RecordMetric,
  title: string,
  description: string,
): RecordCategory {
  const entries = assignRanks(
    playerIds.map(
      (
        playerId,
      ): UnrankedEntry => {
        const stats =
          getFormatStats(
            playerId,
            format,
          );

        return {
          playerId,
          value: stats.points,
          displayValue:
            formatPoints(
              stats.points,
            ),
          played: stats.played,
          wins: stats.wins,
          ties: stats.ties,
          losses: stats.losses,
          winPercentage:
            stats.winPercentage,
          format,
        };
      },
    ),
    compareByValue,
  );

  return createCategory(
    id,
    title,
    description,
    entries,
  );
}

function buildBestSeasonPoints(
  playerIds: string[],
): RecordCategory {
  const entries = assignRanks(
    playerIds
      .map(
        (
          playerId,
        ): UnrankedEntry | undefined => {
          const bestSeason =
            getPlayerTrendAnalytics(
              playerId,
            ).bestSeason;

          if (!bestSeason) {
            return undefined;
          }

          return {
            playerId,
            value:
              bestSeason.points,
            displayValue: `${formatPoints(
              bestSeason.points,
            )} points`,
            played:
              bestSeason.played,
            wins:
              bestSeason.wins,
            ties:
              bestSeason.ties,
            losses:
              bestSeason.losses,
            winPercentage:
              bestSeason.winPercentage,
            year:
              bestSeason.year,
          };
        },
      )
      .filter(
        (
          entry,
        ): entry is UnrankedEntry =>
          Boolean(entry),
      ),
    compareByValue,
  );

  return createCategory(
    "best-season-points",
    "Best Individual Season",
    "Most points earned by one player during a single Cyder Cup.",
    entries,
  );
}

export function getSiteRecordBook(
  playerIds: string[],
): SiteRecordBook {
  const uniquePlayerIds =
    Array.from(
      new Set(
        playerIds.filter(Boolean),
      ),
    );

  const careerPoints =
    buildCareerPoints(
      uniquePlayerIds,
    );

  const careerWins =
    buildCareerWins(
      uniquePlayerIds,
    );

  const careerWinPercentage =
    buildCareerWinPercentage(
      uniquePlayerIds,
    );

  const longestUnbeatenStreak =
    buildLongestUnbeatenStreak(
      uniquePlayerIds,
    );

  const singlesPoints =
    buildFormatPointsCategory(
      uniquePlayerIds,
      "Singles",
      "singles-points",
      "Singles Points",
      "Most career points earned in Singles matches.",
    );

  const fourballPoints =
    buildFormatPointsCategory(
      uniquePlayerIds,
      "Fourball",
      "fourball-points",
      "Four-ball Points",
      "Most career points earned in Four-ball matches.",
    );

  const scramblePoints =
    buildFormatPointsCategory(
      uniquePlayerIds,
      "Scramble",
      "scramble-points",
      "Scramble Points",
      "Most career points earned in two-player Scramble matches.",
    );

  const bestSeasonPoints =
    buildBestSeasonPoints(
      uniquePlayerIds,
    );

  const categories = [
    careerPoints,
    careerWins,
    careerWinPercentage,
    longestUnbeatenStreak,
    singlesPoints,
    fourballPoints,
    scramblePoints,
    bestSeasonPoints,
  ];

  return {
    playerIds:
      uniquePlayerIds,

    careerPoints,
    careerWins,
    careerWinPercentage,
    longestUnbeatenStreak,

    singlesPoints,
    fourballPoints,
    scramblePoints,

    bestSeasonPoints,

    categories,
  };
}

export function getRecordCategory(
  playerIds: string[],
  metric: RecordMetric,
): RecordCategory | undefined {
  return getSiteRecordBook(
    playerIds,
  ).categories.find(
    (category) =>
      category.id === metric,
  );
}

export function getPlayerRecordBookEntries(
  playerId: string,
  playerIds: string[],
): Array<{
  category: RecordCategory;
  entry: RecordBookEntry;
}> {
  return getSiteRecordBook(
    playerIds,
  ).categories
    .map((category) => {
      const entry =
        category.entries.find(
          (candidate) =>
            candidate.playerId ===
            playerId,
        );

      if (!entry) {
        return undefined;
      }

      return {
        category,
        entry,
      };
    })
    .filter(
      (
        item,
      ): item is {
        category: RecordCategory;
        entry: RecordBookEntry;
      } => Boolean(item),
    );
}

export function formatRecordBookEntryRecord(
  entry: RecordBookEntry,
): string {
  return formatRecord(entry);
}