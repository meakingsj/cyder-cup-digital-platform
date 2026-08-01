import {
  getMatchHistoryByPlayer,
  type MatchHistoryRecord,
} from "../data/matchHistory";

import type {
  PartnerMatchSummary,
  PlayerPartnerAnalytics,
} from "./types";

import {
  getUniqueMatchIds,
  getUniqueYears,
  splitDelimitedValues,
  summarizeRecords,
} from "./utils";

function getPartnerIds(
  record: MatchHistoryRecord,
): string[] {
  if (
    record.format === "Singles" ||
    record.format === "4-man Scramble"
  ) {
    return [];
  }

  return splitDelimitedValues(
    record.partner_player_ids,
  );
}

function getPartnerNames(
  record: MatchHistoryRecord,
): string[] {
  return splitDelimitedValues(
    record.partner_names,
  );
}

function buildPartnerSummary(
  playerId: string,
  partnerId: string,
  partnerName: string | undefined,
  records: MatchHistoryRecord[],
): PartnerMatchSummary {
  return {
    playerId,
    partnerId,
    partnerName,
    matchIds:
      getUniqueMatchIds(records),
    years:
      getUniqueYears(records),
    ...summarizeRecords(records),
  };
}

function compareBestPartner(
  a: PartnerMatchSummary,
  b: PartnerMatchSummary,
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

  if (b.played !== a.played) {
    return b.played - a.played;
  }

  return a.partnerId.localeCompare(
    b.partnerId,
  );
}

function compareMostFrequentPartner(
  a: PartnerMatchSummary,
  b: PartnerMatchSummary,
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

  return a.partnerId.localeCompare(
    b.partnerId,
  );
}

export function getPlayerPartnerAnalytics(
  playerId: string,
): PlayerPartnerAnalytics {
  const records =
    getMatchHistoryByPlayer(playerId);

  const partnerMap = new Map<
    string,
    {
      name?: string;
      records: MatchHistoryRecord[];
    }
  >();

  for (const record of records) {
    const partnerIds =
      getPartnerIds(record);

    const partnerNames =
      getPartnerNames(record);

    partnerIds.forEach(
      (partnerId, index) => {
        const existing =
          partnerMap.get(partnerId);

        if (existing) {
          existing.records.push(record);

          if (
            !existing.name &&
            partnerNames[index]
          ) {
            existing.name =
              partnerNames[index];
          }

          return;
        }

        partnerMap.set(partnerId, {
          name: partnerNames[index],
          records: [record],
        });
      },
    );
  }

  const partners = Array.from(
    partnerMap.entries(),
  )
    .map(
      ([
        partnerId,
        value,
      ]) =>
        buildPartnerSummary(
          playerId,
          partnerId,
          value.name,
          value.records,
        ),
    )
    .sort(
      compareMostFrequentPartner,
    );

  const bestPartner = [...partners]
    .filter(
      (partner) =>
        partner.played > 0,
    )
    .sort(compareBestPartner)[0];

  const mostFrequentPartner =
    partners[0];

  return {
    playerId,
    partners,
    bestPartner,
    mostFrequentPartner,
  };
}

export function getPartnerRecord(
  playerId: string,
  partnerId: string,
): PartnerMatchSummary | undefined {
  return getPlayerPartnerAnalytics(
    playerId,
  ).partners.find(
    (partner) =>
      partner.partnerId === partnerId,
  );
}