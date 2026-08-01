/*
 * Compatibility exports.
 *
 * Analytics calculations now live in
 * src/analytics. Existing imports from
 * src/data/playerStats remain functional
 * while the website is migrated.
 */

export {
  getPlayerCareerStats,
  getPlayerFormatStats,
  getPlayerYearStats,
  summarizeRecords,
} from "../analytics/player";

export type {
  RecordSummary,
  PlayerFormatStats,
  PlayerYearStats,
  PlayerStreakStats,
  PartnerRecord,
  SinglesOpponentRecord,
  PlayerCareerStats,
} from "../analytics/types";