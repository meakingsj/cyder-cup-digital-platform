import rawMatches from "./generated/matches.json";
import rawSiteConfig from "./generated/site-config.json";
import { getPlayerById, getPlayersByTeam } from "./player";
import type { TeamId } from "../types";

export type LiveStatus = "upcoming" | "live" | "complete";

interface MatchFeedRow {
  match_id: string | null;
  tournament_id: string;
  session_id: string | null;
  match_number: number | null;
  event_name: string | null;
  format: string | null;
  status: string | null;
  navy_player_1: string | null;
  navy_player_2: string | null;
  red_player_1: string | null;
  red_player_2: string | null;
  start_time: string | number | null;
  current_hole: string | number | null;
  display_score: string | number | null;
  result: string | null;
  navy_points: number | null;
  red_points: number | null;
  points_available: number | null;
}

interface SiteConfigFeed {
  current_tournament_id: string;
  site_title: string;
  live_scoring_enabled: boolean;
  timezone: string;
  navy_team_id: TeamId;
  red_team_id: TeamId;
  points_to_win: number;
  total_points_available: number;
  data_version: string;
}

export interface LiveMatch {
  id: string;
  tournamentId: string;
  sessionId: string;
  matchNumber: number;
  eventName: string;
  format: string;
  status: LiveStatus;
  navyPlayerIds: string[];
  redPlayerIds: string[];
  navyNames: string[];
  redNames: string[];
  startTime?: string;
  currentHole?: string;
  displayScore?: string;
  result?: string;
  navyPoints: number;
  redPoints: number;
  pointsAvailable: number;
}

export interface LiveSession {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  matches: LiveMatch[];
}

export const siteConfig = rawSiteConfig as SiteConfigFeed;

function normalizeStatus(value: string | null): LiveStatus {
  const status = (value ?? "").trim().toLowerCase();
  if (["complete", "completed", "final", "finished"].includes(status)) return "complete";
  if (["in progress", "in-progress", "live", "active"].includes(status)) return "live";
  return "upcoming";
}

function playerNames(ids: Array<string | null>, team: TeamId): string[] {
  const cleanIds = ids.filter((id): id is string => Boolean(id));
  if (cleanIds.some((id) => id === `all-${team}`)) {
    return getPlayersByTeam(team).map((player) => player.displayName);
  }
  return cleanIds.map((id) => getPlayerById(id).displayName);
}

function normalizeScore(value: string | number | null): string | undefined {
  if (value === null || value === "" || value === 0 || value === "0") return undefined;
  return String(value);
}

export const liveMatches: LiveMatch[] = (rawMatches as MatchFeedRow[])
  .filter((row): row is MatchFeedRow & { match_id: string; session_id: string; match_number: number; event_name: string; format: string } =>
    Boolean(row.match_id && row.session_id && row.match_number && row.event_name && row.format),
  )
  .map((row) => {
    const navyIds = [row.navy_player_1, row.navy_player_2].filter((id): id is string => Boolean(id));
    const redIds = [row.red_player_1, row.red_player_2].filter((id): id is string => Boolean(id));

    return {
      id: row.match_id,
      tournamentId: row.tournament_id,
      sessionId: row.session_id,
      matchNumber: row.match_number,
      eventName: row.event_name,
      format: row.format,
      status: normalizeStatus(row.status),
      navyPlayerIds: navyIds,
      redPlayerIds: redIds,
      navyNames: playerNames(navyIds, "navy"),
      redNames: playerNames(redIds, "red"),
      startTime: row.start_time ? String(row.start_time) : undefined,
      currentHole: row.current_hole ? String(row.current_hole) : undefined,
      displayScore: normalizeScore(row.display_score),
      result: row.result ?? undefined,
      navyPoints: row.navy_points ?? 0,
      redPoints: row.red_points ?? 0,
      pointsAvailable: row.points_available ?? 0,
    };
  });

const sessionMeta: Record<string, Omit<LiveSession, "matches">> = {
  "session-1": {
    id: "session-1",
    label: "Scramble & Games",
    shortLabel: "Session 1",
    description: "Opening scramble and five off-course team contests.",
  },
  "session-2": {
    id: "session-2",
    label: "Fourball",
    shortLabel: "Session 2",
    description: "Two net fourball matches, each worth three points.",
  },
  "session-3": {
    id: "session-3",
    label: "Singles",
    shortLabel: "Session 3",
    description: "Four closing singles matches with the Cup on the line.",
  },
};

export const liveSessions: LiveSession[] = Object.values(sessionMeta)
  .map((session) => ({
    ...session,
    matches: liveMatches
      .filter((match) => match.sessionId === session.id)
      .sort((a, b) => a.matchNumber - b.matchNumber),
  }))
  .filter((session) => session.matches.length > 0);

export const navyScore = liveMatches.reduce((total, match) => total + match.navyPoints, 0);
export const redScore = liveMatches.reduce((total, match) => total + match.redPoints, 0);
export const pointsAwarded = navyScore + redScore;
export const matchesComplete = liveMatches.filter((match) => match.status === "complete").length;
export const matchesLive = liveMatches.filter((match) => match.status === "live").length;
export const pointsRemaining = Math.max(siteConfig.total_points_available - pointsAwarded, 0);
