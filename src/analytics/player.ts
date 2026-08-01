import {
  getMatchHistoryByPlayer,
  type MatchFormat,
  type MatchHistoryRecord,
  type MatchResult,
} from "../data/matchHistory";

import type {
  PartnerRecord,
  PlayerCareerStats,
  PlayerFormatStats,
  PlayerStreakStats,
  PlayerYearStats,
  SinglesOpponentRecord,
} from "./types";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  sortChronologically,
  summarizeRecords,
} from "./utils";

function calculateStreaks(
  records: MatchHistoryRecord[],
): PlayerStreakStats {
  const results = sortChronologically(
    records,
  ).map((record) => record.result);

  const isUnbeaten = (
    result: MatchResult,
  ): boolean => result !== "L";

  const isWin = (
    result: MatchResult,
  ): boolean => result === "W";

  return {
    currentUnbeatenStreak:
      calculateCurrentStreak(
        results,
        isUnbeaten,
      ),

    longestUnbeatenStreak:
      calculateLongestStreak(
        results,
        isUnbeaten,
      ),

    currentWinningStreak:
      calculateCurrentStreak(
        results,
        isWin,
      ),

    longestWinningStreak:
      calculateLongestStreak(
        results,
        isWin,
      ),
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
    .map((format) => ({
      format,
      ...summarizeRecords(
        records.filter(
          (record) =>
            record.format === format,
        ),
      ),
    }))
    .sort((a, b) =>
      a.format.localeCompare(b.format),
    );
}

function buildYearStats(
  records: MatchHistoryRecord[],
): PlayerYearStats[] {
  const years = Array.from(
    new Set(
      records.map(
        (record) => record.year,
      ),
    ),
  );

  return years
    .map((year) => ({
      year,
      ...summarizeRecords(
        records.filter(
          (record) =>
            record.year === year,
        ),
      ),
    }))
    .sort((a, b) => a.year - b.year);
}

function buildPartnerRecords(
  records: MatchHistoryRecord[],
): PartnerRecord[] {
  const partnerMap = new Map<
    string,
    {
      name?: string;
      records: MatchHistoryRecord[];
    }
  >();

  for (const record of records) {
    const partnerId =
      record.partner_player_ids?.trim();

    if (!partnerId) {
      continue;
    }

    const existing =
      partnerMap.get(partnerId);

    if (existing) {
      existing.records.push(record);
      continue;
    }

    partnerMap.set(partnerId, {
      name:
        record.partner_names?.trim() ||
        undefined,
      records: [record],
    });
  }

  return Array.from(
    partnerMap.entries(),
  )
    .map(([partnerId, value]) => ({
      partnerId,
      partnerName: value.name,
      ...summarizeRecords(
        value.records,
      ),
    }))
    .sort((a, b) => {
      if (b.played !== a.played) {
        return b.played - a.played;
      }

      return b.points - a.points;
    });
}

function buildSinglesOpponentRecords(
  records: MatchHistoryRecord[],
): SinglesOpponentRecord[] {
  const opponentMap = new Map<
    string,
    {
      name?: string;
      records: MatchHistoryRecord[];
    }
  >();

  for (const record of records) {
    if (record.format !== "Singles") {
      continue;
    }

    const opponentId =
      record.opponent_1_id?.trim();

    if (!opponentId) {
      continue;
    }

    const existing =
      opponentMap.get(opponentId);

    if (existing) {
      existing.records.push(record);
      continue;
    }

    opponentMap.set(opponentId, {
      name:
        record.opponent_1_name?.trim() ||
        undefined,
      records: [record],
    });
  }

  return Array.from(
    opponentMap.entries(),
  )
    .map(([opponentId, value]) => ({
      opponentId,
      opponentName: value.name,
      ...summarizeRecords(
        value.records,
      ),
    }))
    .sort((a, b) => {
      if (b.played !== a.played) {
        return b.played - a.played;
      }

      return b.points - a.points;
    });
}

export function getPlayerCareerStats(
  playerId: string,
): PlayerCareerStats {
  const records =
    getMatchHistoryByPlayer(playerId);

  return {
    playerId,
    ...summarizeRecords(records),
    ...calculateStreaks(records),
    formats: buildFormatStats(records),
    years: buildYearStats(records),
    partnerRecords:
      buildPartnerRecords(records),
    singlesOpponentRecords:
      buildSinglesOpponentRecords(
        records,
      ),
  };
}

export function getPlayerFormatStats(
  playerId: string,
  format: MatchFormat,
): PlayerFormatStats {
  const records =
    getMatchHistoryByPlayer(
      playerId,
    ).filter(
      (record) =>
        record.format === format,
    );

  return {
    format,
    ...summarizeRecords(records),
  };
}

export function getPlayerYearStats(
  playerId: string,
  year: number,
): PlayerYearStats {
  const records =
    getMatchHistoryByPlayer(
      playerId,
    ).filter(
      (record) =>
        record.year === year,
    );

  return {
    year,
    ...summarizeRecords(records),
  };
}

export {
  summarizeRecords,
} from "./utils";