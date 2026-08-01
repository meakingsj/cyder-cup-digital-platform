import {
  getPlayerCareerStats,
  getPlayerFormatStats,
  getPlayerYearStats,
} from "./player";

import {
  getPartnerRecord,
  getPlayerPartnerAnalytics,
} from "./partners";

import {
  getHeadToHeadFormatRecord,
  getHeadToHeadRecord,
  getPlayerHeadToHeadAnalytics,
} from "./headToHead";

import {
  getPlayerBestSeason,
  getPlayerCurrentForm,
  getPlayerSeasonSummary,
  getPlayerTrendAnalytics,
} from "./trends";

import {
  getPlayerRanking,
  getPlayerRankings,
} from "./rankings";

import {
  formatRecordBookEntryRecord,
  getPlayerRecordBookEntries,
  getRecordCategory,
  getSiteRecordBook,
} from "./records";

import {
  getTeamAnalytics,
  getTeamComparison,
  getTeamFormatStats,
  getTeamMatches,
  getTeamSeasonStats,
} from "./team";

export const analytics = {
  player: {
    getCareerStats:
      getPlayerCareerStats,

    getFormatStats:
      getPlayerFormatStats,

    getYearStats:
      getPlayerYearStats,

    getPartnerAnalytics:
      getPlayerPartnerAnalytics,

    getPartnerRecord,

    getHeadToHeadAnalytics:
      getPlayerHeadToHeadAnalytics,

    getHeadToHeadRecord,

    getHeadToHeadFormatRecord,

    getTrendAnalytics:
      getPlayerTrendAnalytics,

    getCurrentForm:
      getPlayerCurrentForm,

    getSeasonSummary:
      getPlayerSeasonSummary,

    getBestSeason:
      getPlayerBestSeason,

    getRanking:
      getPlayerRanking,

    getRecordBookEntries:
      getPlayerRecordBookEntries,
  },

  rankings: {
    getAll:
      getPlayerRankings,

    getPlayer:
      getPlayerRanking,
  },

  records: {
    getAll:
      getSiteRecordBook,

    getCategory:
      getRecordCategory,

    getPlayerEntries:
      getPlayerRecordBookEntries,

    formatEntryRecord:
      formatRecordBookEntryRecord,
  },

  team: {
    getAnalytics:
      getTeamAnalytics,

    getComparison:
      getTeamComparison,

    getFormatStats:
      getTeamFormatStats,

    getSeasonStats:
      getTeamSeasonStats,

    getMatches:
      getTeamMatches,
  },
} as const;

export {
  getPlayerCareerStats,
  getPlayerFormatStats,
  getPlayerYearStats,
  summarizeRecords,
} from "./player";

export {
  getPartnerRecord,
  getPlayerPartnerAnalytics,
} from "./partners";

export {
  getHeadToHeadFormatRecord,
  getHeadToHeadRecord,
  getPlayerHeadToHeadAnalytics,
} from "./headToHead";

export {
  getPlayerBestSeason,
  getPlayerCurrentForm,
  getPlayerSeasonSummary,
  getPlayerTrendAnalytics,
} from "./trends";

export {
  getPlayerRanking,
  getPlayerRankings,
} from "./rankings";

export {
  formatRecordBookEntryRecord,
  getPlayerRecordBookEntries,
  getRecordCategory,
  getSiteRecordBook,
} from "./records";

export {
  getTeamAnalytics,
  getTeamComparison,
  getTeamFormatStats,
  getTeamMatches,
  getTeamSeasonStats,
} from "./team";

export type {
  RecordSummary,
  PlayerFormatStats,
  PlayerYearStats,
  PlayerStreakStats,
  PartnerRecord,
  SinglesOpponentRecord,
  PlayerCareerStats,
  PlayerAnalyticsSource,
  PartnerMatchSummary,
  PlayerPartnerAnalytics,
  HeadToHeadFormatSummary,
  HeadToHeadLastMatch,
  HeadToHeadStreak,
  HeadToHeadOpponentSummary,
  PlayerHeadToHeadAnalytics,
  PlayerFormMatch,
  PlayerCurrentForm,
  PlayerSeasonSummary,
  PlayerTrendAnalytics,
  PlayerRankingEntry,
  PlayerRankings,
  TeamMatchSummary,
  TeamFormatStats,
  TeamYearStats,
  TeamPlayerContribution,
  TeamAnalytics,
  TeamComparison,
} from "./types";

export type {
  RecordMetric,
  RecordBookEntry,
  RecordCategory,
  SiteRecordBook,
} from "./records";