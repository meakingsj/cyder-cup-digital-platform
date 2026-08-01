import {
  getPlayerCareerStats,
  getPlayerHeadToHeadAnalytics,
  getPlayerPartnerAnalytics,
  getPlayerRanking,
  getPlayerTrendAnalytics,
} from "../analytics";

import { getAwardsByPlayer } from "./awards";
import { getPlayerGallery } from "./playerGallery";

import {
  getPlayerMedia,
  getPrimaryMedia,
} from "./media";

import { players } from "./index";
import { records } from "./records";

export interface PlayerProfile {
  player: (typeof players)[number];

  stats: ReturnType<
    typeof getPlayerCareerStats
  >;

  partnerAnalytics: ReturnType<
    typeof getPlayerPartnerAnalytics
  >;

  headToHeadAnalytics: ReturnType<
    typeof getPlayerHeadToHeadAnalytics
  >;

  trendAnalytics: ReturnType<
    typeof getPlayerTrendAnalytics
  >;

  ranking: ReturnType<
    typeof getPlayerRanking
  >;

  gallery: ReturnType<
    typeof getPlayerGallery
  >;

  records: typeof records;

  awards: ReturnType<
    typeof getAwardsByPlayer
  >;

  media: ReturnType<
    typeof getPlayerMedia
  >;

  primaryMedia: ReturnType<
    typeof getPrimaryMedia
  >;

  appearanceYears: number[];

  appearances: number;
}

export function getPlayerProfile(
  playerId: string,
): PlayerProfile | undefined {
  const player = players.find(
    (candidate) =>
      candidate.id === playerId,
  );

  if (!player) {
    return undefined;
  }

  const playerIds =
    players.map(
      (candidate) =>
        candidate.id,
    );

  const gallery =
    getPlayerGallery(playerId);

  const appearanceYears = Array.from(
    new Set(
      gallery.map(
        (image) => image.year,
      ),
    ),
  ).sort((a, b) => b - a);

  const stats =
    getPlayerCareerStats(playerId);

  const partnerAnalytics =
    getPlayerPartnerAnalytics(playerId);

  const headToHeadAnalytics =
    getPlayerHeadToHeadAnalytics(
      playerId,
    );

  const trendAnalytics =
    getPlayerTrendAnalytics(playerId);

  const ranking =
    getPlayerRanking(
      playerId,
      playerIds,
    );

  return {
    player,
    stats,
    partnerAnalytics,
    headToHeadAnalytics,
    trendAnalytics,
    ranking,
    gallery,

    records: records.filter(
      (record) =>
        record.playerId === playerId,
    ),

    awards:
      getAwardsByPlayer(playerId),

    media:
      getPlayerMedia(playerId),

    primaryMedia: getPrimaryMedia(
      "player",
      playerId,
      "profile",
    ),

    appearanceYears,

    appearances:
      stats.years.length,
  };
}