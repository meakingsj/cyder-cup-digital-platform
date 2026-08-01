import rawMatches from "./generated/matches.json";
import rawSiteConfig from "./generated/site-config.json";

import {
  getPlayerById,
  getPlayersByTeam,
} from "./player";

import type { TeamId } from "../types";

export type LiveStatus =
  | "upcoming"
  | "live"
  | "complete";

export type LiveSessionId =
  | "scramble"
  | "fourball"
  | "singles"
  | "evening-events";

export type MatchWinner =
  | TeamId
  | "tie"
  | undefined;

interface MatchFeedRow {
  match_id: string | null;
  tournament_id: string;
  session_id: string | null;
  match_number: number | null;
  event_name: string | null;
  format: string | null;
  status: string | null;

  tee_group?: string | null;

  navy_player_1: string | null;
  navy_player_2: string | null;
  red_player_1: string | null;
  red_player_2: string | null;

  scheduled_date?: string | number | null;
  start_time: string | number | null;

  current_hole: string | number | null;
  display_score: string | number | null;

  front_9?: string | number | null;
  back_9?: string | number | null;
  total_score?: string | number | null;

  result: string | number | null;

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

export interface LiveParticipant {
  id: string;
  displayName: string;
  photoPath?: string;
}

export interface LiveMatch {
  id: string;
  tournamentId: string;

  sourceSessionId: string;
  sessionId: LiveSessionId;

  matchNumber: number;
  eventName: string;
  format: string;
  status: LiveStatus;

  teeGroup?: string;
  scheduledDate?: string;
  startTime?: string;

  navyPlayerIds: string[];
  redPlayerIds: string[];

  navyParticipants: LiveParticipant[];
  redParticipants: LiveParticipant[];

  navyNames: string[];
  redNames: string[];

  navyFullTeam: boolean;
  redFullTeam: boolean;

  currentHole?: string;
  displayScore?: string;

  frontNine?: string;
  backNine?: string;
  totalScore?: string;

  result?: string;

  navyPoints: number;
  redPoints: number;
  pointsAvailable: number;

  winnerTeam?: MatchWinner;
}

export interface LiveSession {
  id: LiveSessionId;
  label: string;
  shortLabel: string;
  description: string;
  scheduleLabel: string;

  matches: LiveMatch[];

  status: LiveStatus;
  navyPoints: number;
  redPoints: number;
  pointsAwarded: number;
  pointsAvailable: number;
  winnerTeam?: MatchWinner;
}

export const siteConfig =
  rawSiteConfig as SiteConfigFeed;

function normalizeStatus(
  value: string | null,
): LiveStatus {
  const status = (value ?? "")
    .trim()
    .toLowerCase();

  if (
    [
      "complete",
      "completed",
      "final",
      "finished",
    ].includes(status)
  ) {
    return "complete";
  }

  if (
    [
      "in progress",
      "in-progress",
      "live",
      "active",
      "on course",
      "on-course",
    ].includes(status)
  ) {
    return "live";
  }

  return "upcoming";
}

function normalizeFormat(
  value: string | null,
): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");
}

function getLogicalSessionId(
  format: string,
): LiveSessionId {
  if (
    format === "fourball" ||
    format === "four-ball"
  ) {
    return "fourball";
  }

  if (format === "singles") {
    return "singles";
  }

  if (
    format === "drinking-game" ||
    format === "drinking-games"
  ) {
    return "evening-events";
  }

  return "scramble";
}

function cleanPlayerIds(
  values: Array<string | null>,
): string[] {
  return values
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value?.trim()),
    )
    .map((value) =>
      value.trim(),
    );
}

function isFullTeam(
  ids: string[],
  team: TeamId,
): boolean {
  return ids.some(
    (id) =>
      id === `all-${team}`,
  );
}

function getParticipants(
  ids: string[],
  team: TeamId,
): LiveParticipant[] {
  if (isFullTeam(ids, team)) {
    return getPlayersByTeam(
      team,
    ).map((player) => ({
      id: player.id,
      displayName:
        player.displayName,
      photoPath:
        player.photoPath,
    }));
  }

  return ids.map((id) => {
    try {
      const player =
        getPlayerById(id);

      return {
        id: player.id,
        displayName:
          player.displayName,
        photoPath:
          player.photoPath,
      };
    } catch {
      return {
        id,
        displayName: id,
      };
    }
  });
}

function normalizeOptionalText(
  value:
    | string
    | number
    | null
    | undefined,
): string | undefined {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === 0 ||
    value === "0"
  ) {
    return undefined;
  }

  return String(value).trim();
}

function normalizeDate(
  value:
    | string
    | number
    | null
    | undefined,
): string | undefined {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return undefined;
  }

  if (typeof value === "number") {
    const excelEpoch =
      Date.UTC(
        1899,
        11,
        30,
      );

    const date =
      new Date(
        excelEpoch +
          value *
            86_400_000,
      );

    return date
      .toISOString()
      .slice(0, 10);
  }

  const text =
    value.trim();

  const parsed =
    new Date(text);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return text;
  }

  return [
    parsed.getFullYear(),
    String(
      parsed.getMonth() + 1,
    ).padStart(2, "0"),
    String(
      parsed.getDate(),
    ).padStart(2, "0"),
  ].join("-");
}

function determineWinner(
  status: LiveStatus,
  navyPoints: number,
  redPoints: number,
  result?: string,
): MatchWinner {
  const normalizedResult =
    result
      ?.trim()
      .toLowerCase();

  if (
    normalizedResult === "navy" ||
    normalizedResult ===
      "team navy"
  ) {
    return "navy";
  }

  if (
    normalizedResult === "red" ||
    normalizedResult ===
      "team red"
  ) {
    return "red";
  }

  if (
    normalizedResult === "tie" ||
    normalizedResult === "tied" ||
    normalizedResult ===
      "halved"
  ) {
    return "tie";
  }

  if (status !== "complete") {
    return undefined;
  }

  if (navyPoints > redPoints) {
    return "navy";
  }

  if (redPoints > navyPoints) {
    return "red";
  }

  if (
    navyPoints > 0 ||
    redPoints > 0
  ) {
    return "tie";
  }

  return undefined;
}

export const liveMatches: LiveMatch[] =
  (
    rawMatches as MatchFeedRow[]
  )
    .filter(
      (
        row,
      ): row is MatchFeedRow & {
        match_id: string;
        session_id: string;
        match_number: number;
        event_name: string;
        format: string;
      } =>
        Boolean(
          row.match_id &&
            row.session_id &&
            row.match_number &&
            row.event_name &&
            row.format,
        ),
    )
    .map((row) => {
      const format =
        normalizeFormat(
          row.format,
        );

      const navyIds =
        cleanPlayerIds([
          row.navy_player_1,
          row.navy_player_2,
        ]);

      const redIds =
        cleanPlayerIds([
          row.red_player_1,
          row.red_player_2,
        ]);

      const navyPoints =
        row.navy_points ?? 0;

      const redPoints =
        row.red_points ?? 0;

      const status =
        normalizeStatus(
          row.status,
        );

      const result =
        normalizeOptionalText(
          row.result,
        );

      const navyParticipants =
        getParticipants(
          navyIds,
          "navy",
        );

      const redParticipants =
        getParticipants(
          redIds,
          "red",
        );

      return {
        id: row.match_id,
        tournamentId:
          row.tournament_id,

        sourceSessionId:
          row.session_id,

        sessionId:
          getLogicalSessionId(
            format,
          ),

        matchNumber:
          row.match_number,

        eventName:
          row.event_name,

        format,
        status,

        teeGroup:
          normalizeOptionalText(
            row.tee_group,
          ),

        scheduledDate:
          normalizeDate(
            row.scheduled_date,
          ),

        startTime:
          normalizeOptionalText(
            row.start_time,
          ),

        navyPlayerIds:
          navyIds,

        redPlayerIds:
          redIds,

        navyParticipants,
        redParticipants,

        navyNames:
          navyParticipants.map(
            (player) =>
              player.displayName,
          ),

        redNames:
          redParticipants.map(
            (player) =>
              player.displayName,
          ),

        navyFullTeam:
          isFullTeam(
            navyIds,
            "navy",
          ),

        redFullTeam:
          isFullTeam(
            redIds,
            "red",
          ),

        currentHole:
          normalizeOptionalText(
            row.current_hole,
          ),

        displayScore:
          normalizeOptionalText(
            row.display_score,
          ),

        frontNine:
          normalizeOptionalText(
            row.front_9,
          ),

        backNine:
          normalizeOptionalText(
            row.back_9,
          ),

        totalScore:
          normalizeOptionalText(
            row.total_score,
          ),

        result,

        navyPoints,
        redPoints,

        pointsAvailable:
          row.points_available ?? 0,

        winnerTeam:
          determineWinner(
            status,
            navyPoints,
            redPoints,
            result,
          ),
      };
    });

const sessionMeta: Array<
  Omit<
    LiveSession,
    | "matches"
    | "status"
    | "navyPoints"
    | "redPoints"
    | "pointsAwarded"
    | "pointsAvailable"
    | "winnerTeam"
  >
> = [
  {
    id: "scramble",
    label: "Scramble",
    shortLabel: "Thursday",
    description:
      "Each team posts an eighteen-hole scramble score. The lower total earns the opening three points.",
    scheduleLabel:
      "Thu · 3:40 PM",
  },
  {
    id: "fourball",
    label: "Four-ball",
    shortLabel: "Friday",
    description:
      "Two partner matches, each worth three points.",
    scheduleLabel:
      "Fri · 1:00 PM",
  },
  {
    id: "singles",
    label: "Singles",
    shortLabel: "Saturday",
    description:
      "Four closing matches with the Cup on the line.",
    scheduleLabel:
      "Sat · 12:50 PM",
  },
  {
    id: "evening-events",
    label: "Evening Events",
    shortLabel:
      "Thursday & Friday",
    description:
      "Five off-course contests where dignity and additional points remain available.",
    scheduleLabel:
      "Thu & Fri",
  },
];

function getSessionStatus(
  matches: LiveMatch[],
): LiveStatus {
  if (
    matches.some(
      (match) =>
        match.status === "live",
    )
  ) {
    return "live";
  }

  if (
    matches.length > 0 &&
    matches.every(
      (match) =>
        match.status ===
        "complete",
    )
  ) {
    return "complete";
  }

  return "upcoming";
}

function getSessionWinner(
  status: LiveStatus,
  navyPoints: number,
  redPoints: number,
): MatchWinner {
  if (status !== "complete") {
    return undefined;
  }

  if (navyPoints > redPoints) {
    return "navy";
  }

  if (redPoints > navyPoints) {
    return "red";
  }

  return "tie";
}

export const liveSessions: LiveSession[] =
  sessionMeta
    .map((metadata) => {
      const matches =
        liveMatches
          .filter(
            (match) =>
              match.sessionId ===
              metadata.id,
          )
          .sort(
            (a, b) =>
              a.matchNumber -
              b.matchNumber,
          );

      const navyPoints =
        matches.reduce(
          (
            total,
            match,
          ) =>
            total +
            match.navyPoints,
          0,
        );

      const redPoints =
        matches.reduce(
          (
            total,
            match,
          ) =>
            total +
            match.redPoints,
          0,
        );

      const status =
        getSessionStatus(
          matches,
        );

      const pointsAvailable =
        metadata.id === "scramble"
          ? Math.max(
              ...matches.map(
                (match) =>
                  match.pointsAvailable,
              ),
              0,
            )
          : matches.reduce(
              (
                total,
                match,
              ) =>
                total +
                match.pointsAvailable,
              0,
            );

      return {
        ...metadata,
        matches,
        status,
        navyPoints,
        redPoints,
        pointsAwarded:
          navyPoints +
          redPoints,
        pointsAvailable,
        winnerTeam:
          getSessionWinner(
            status,
            navyPoints,
            redPoints,
          ),
      };
    })
    .filter(
      (session) =>
        session.matches.length >
        0,
    );

export const navyScore =
  liveMatches.reduce(
    (
      total,
      match,
    ) =>
      total +
      match.navyPoints,
    0,
  );

export const redScore =
  liveMatches.reduce(
    (
      total,
      match,
    ) =>
      total +
      match.redPoints,
    0,
  );

export const pointsAwarded =
  navyScore +
  redScore;

export const matchesComplete =
  liveMatches.filter(
    (match) =>
      match.status ===
      "complete",
  ).length;

export const matchesLive =
  liveMatches.filter(
    (match) =>
      match.status === "live",
  ).length;

export const pointsRemaining =
  Math.max(
    siteConfig.total_points_available -
      pointsAwarded,
    0,
  );