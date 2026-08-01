import type {
  MatchHistoryRecord,
  MatchResult,
} from "../data/matchHistory";

import type {
  RecordSummary,
} from "./types";

export function roundPercentage(
  value: number,
): number {
  return Math.round(value * 10) / 10;
}

export function summarizeRecords(
  records: MatchHistoryRecord[],
): RecordSummary {
  const wins = records.filter(
    (record) => record.result === "W",
  ).length;

  const ties = records.filter(
    (record) => record.result === "T",
  ).length;

  const losses = records.filter(
    (record) => record.result === "L",
  ).length;

  const played = records.length;

  const points = records.reduce(
    (total, record) =>
      total + record.points_earned,
    0,
  );

  const winPercentage =
    played === 0
      ? 0
      : roundPercentage(
          ((wins + ties * 0.5) / played) *
            100,
        );

  const unbeatenPercentage =
    played === 0
      ? 0
      : roundPercentage(
          ((wins + ties) / played) *
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

export function sortChronologically(
  records: MatchHistoryRecord[],
): MatchHistoryRecord[] {
  return [...records].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }

    if (
      a.source_record_book_row !==
      b.source_record_book_row
    ) {
      return (
        a.source_record_book_row -
        b.source_record_book_row
      );
    }

    return a.match_id.localeCompare(
      b.match_id,
    );
  });
}

export function getUniqueMatchIds(
  records: MatchHistoryRecord[],
): string[] {
  return Array.from(
    new Set(
      records.map(
        (record) => record.match_id,
      ),
    ),
  );
}

export function getUniqueYears(
  records: MatchHistoryRecord[],
): number[] {
  return Array.from(
    new Set(
      records.map(
        (record) => record.year,
      ),
    ),
  ).sort((a, b) => a - b);
}

export function splitDelimitedValues(
  value?: string | null,
): string[] {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return [];
  }

  return trimmedValue
    .split(/[|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function calculateLongestStreak(
  results: MatchResult[],
  qualifies: (
    result: MatchResult,
  ) => boolean,
): number {
  let longest = 0;
  let current = 0;

  for (const result of results) {
    if (qualifies(result)) {
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

export function calculateCurrentStreak(
  results: MatchResult[],
  qualifies: (
    result: MatchResult,
  ) => boolean,
): number {
  let current = 0;

  for (
    let index = results.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (!qualifies(results[index])) {
      break;
    }

    current += 1;
  }

  return current;
}