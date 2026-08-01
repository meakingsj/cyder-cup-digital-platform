import {
  getMatchHistoryByPlayer,
  type MatchFormat,
  type MatchHistoryRecord,
} from "../data/matchHistory";

import type {
  HeadToHeadFormatSummary,
  HeadToHeadLastMatch,
  HeadToHeadOpponentSummary,
  HeadToHeadStreak,
  PlayerHeadToHeadAnalytics,
} from "./types";

import {
  getUniqueMatchIds,
  getUniqueYears,
  sortChronologically,
  splitDelimitedValues,
  summarizeRecords,
} from "./utils";

interface OpponentEntry {
  name?: string;
  records: MatchHistoryRecord[];
}

function isPlayerOpponentId(
  opponentId: string,
): boolean {
  const normalizedId =
    opponentId.trim().toLowerCase();

  if (!normalizedId) {
    return false;
  }

  /*
   * Team-level IDs are intentionally excluded.
   * The Team Vs. Team 4-man Scramble does not
   * represent an individual player rivalry.
   */
  if (normalizedId.startsWith("all-")) {
    return false;
  }

  return true;
}

function getOpponentIds(
  record: MatchHistoryRecord,
): string[] {
  const opponentIds = [
    ...splitDelimitedValues(
      record.opponent_1_id,
    ),
    ...splitDelimitedValues(
      record.opponent_2_id,
    ),
  ];

  return Array.from(
    new Set(
      opponentIds.filter(
        isPlayerOpponentId,
      ),
    ),
  );
}

function getOpponentNameMap(
  record: MatchHistoryRecord,
): Map<string, string> {
  const nameMap = new Map<
    string,
    string
  >();

  const opponent1Ids =
    splitDelimitedValues(
      record.opponent_1_id,
    );

  const opponent1Names =
    splitDelimitedValues(
      record.opponent_1_name,
    );

  opponent1Ids.forEach(
    (opponentId, index) => {
      const opponentName =
        opponent1Names[index];

      if (opponentName) {
        nameMap.set(
          opponentId,
          opponentName,
        );
      }
    },
  );

  const opponent2Ids =
    splitDelimitedValues(
      record.opponent_2_id,
    );

  const opponent2Names =
    splitDelimitedValues(
      record.opponent_2_name,
    );

  opponent2Ids.forEach(
    (opponentId, index) => {
      const opponentName =
        opponent2Names[index];

      if (opponentName) {
        nameMap.set(
          opponentId,
          opponentName,
        );
      }
    },
  );

  return nameMap;
}

function buildFormatSummaries(
  records: MatchHistoryRecord[],
): HeadToHeadFormatSummary[] {
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
      ): HeadToHeadFormatSummary => ({
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

function buildLastMatch(
  records: MatchHistoryRecord[],
): HeadToHeadLastMatch | undefined {
  const chronologicalRecords =
    sortChronologically(records);

  const record =
    chronologicalRecords[
      chronologicalRecords.length - 1
    ];

  if (!record) {
    return undefined;
  }

  return {
    matchId: record.match_id,
    tournamentId:
      record.tournament_id,
    year: record.year,
    format: record.format,
    result: record.result,
    pointsEarned:
      record.points_earned,
    course:
      record.course?.trim() ||
      undefined,
    scoreNotes:
      record.score_notes?.trim() ||
      undefined,
  };
}

function buildCurrentStreak(
  records: MatchHistoryRecord[],
): HeadToHeadStreak | undefined {
  const chronologicalRecords =
    sortChronologically(records);

  const latestRecord =
    chronologicalRecords[
      chronologicalRecords.length - 1
    ];

  if (!latestRecord) {
    return undefined;
  }

  const latestResult =
    latestRecord.result;

  let length = 0;

  for (
    let index =
      chronologicalRecords.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (
      chronologicalRecords[index]
        .result !== latestResult
    ) {
      break;
    }

    length += 1;
  }

  return {
    result: latestResult,
    length,
  };
}

function buildOpponentSummary(
  playerId: string,
  opponentId: string,
  opponentName: string | undefined,
  records: MatchHistoryRecord[],
): HeadToHeadOpponentSummary {
  const singlesRecords =
    records.filter(
      (record) =>
        record.format === "Singles",
    );

  return {
    playerId,
    opponentId,
    opponentName,
    matchIds:
      getUniqueMatchIds(records),
    years:
      getUniqueYears(records),
    formats:
      buildFormatSummaries(records),
    singles:
      summarizeRecords(
        singlesRecords,
      ),
    lastMatch:
      buildLastMatch(records),
    currentStreak:
      buildCurrentStreak(records),
    ...summarizeRecords(records),
  };
}

function compareMostPlayedOpponent(
  a: HeadToHeadOpponentSummary,
  b: HeadToHeadOpponentSummary,
): number {
  if (b.played !== a.played) {
    return b.played - a.played;
  }

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

  return a.opponentId.localeCompare(
    b.opponentId,
  );
}

function compareBestRecord(
  a: HeadToHeadOpponentSummary,
  b: HeadToHeadOpponentSummary,
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

  return a.opponentId.localeCompare(
    b.opponentId,
  );
}

export function getPlayerHeadToHeadAnalytics(
  playerId: string,
): PlayerHeadToHeadAnalytics {
  const records =
    getMatchHistoryByPlayer(playerId);

  const opponentMap = new Map<
    string,
    OpponentEntry
  >();

  for (const record of records) {
    const opponentIds =
      getOpponentIds(record);

    const opponentNameMap =
      getOpponentNameMap(record);

    for (const opponentId of opponentIds) {
      const existing =
        opponentMap.get(opponentId);

      if (existing) {
        existing.records.push(record);

        if (!existing.name) {
          existing.name =
            opponentNameMap.get(
              opponentId,
            );
        }

        continue;
      }

      opponentMap.set(opponentId, {
        name:
          opponentNameMap.get(
            opponentId,
          ),
        records: [record],
      });
    }
  }

  const opponents = Array.from(
    opponentMap.entries(),
  )
    .map(
      ([
        opponentId,
        value,
      ]) =>
        buildOpponentSummary(
          playerId,
          opponentId,
          value.name,
          value.records,
        ),
    )
    .sort(
      compareMostPlayedOpponent,
    );

  const bestRecord = [...opponents]
    .filter(
      (opponent) =>
        opponent.played > 0,
    )
    .sort(compareBestRecord)[0];

  const mostPlayedOpponent =
    opponents[0];

  return {
    playerId,
    opponents,
    bestRecord,
    mostPlayedOpponent,
  };
}

export function getHeadToHeadRecord(
  playerId: string,
  opponentId: string,
): HeadToHeadOpponentSummary | undefined {
  return getPlayerHeadToHeadAnalytics(
    playerId,
  ).opponents.find(
    (opponent) =>
      opponent.opponentId ===
      opponentId,
  );
}

export function getHeadToHeadFormatRecord(
  playerId: string,
  opponentId: string,
  format: MatchFormat,
): HeadToHeadFormatSummary {
  const opponentRecord =
    getHeadToHeadRecord(
      playerId,
      opponentId,
    );

  const existingFormat =
    opponentRecord?.formats.find(
      (formatRecord) =>
        formatRecord.format === format,
    );

  if (existingFormat) {
    return existingFormat;
  }

  return {
    format,
    ...summarizeRecords([]),
  };
}