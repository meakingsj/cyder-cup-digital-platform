import generatedPlayers from "./generated/players.json";
import type { Player, TeamId } from "../types";

interface PlayerFeedRow {
  player_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  team_id: TeamId;
  active: boolean;
  handicap: number;
  hometown?: string;
  home_course?: string;
  favorite_drink?: string;
  walkout_music?: string;
  bio?: string;
  career_wins: number;
  career_losses: number;
  career_ties: number;
  career_matches: number;
  career_points: number;
  career_points_percentage: number;
  photo_key?: string;
}

function cleanOptional(value?: string): string | undefined {
  if (!value || value.trim().toUpperCase() === "TBD") {
    return undefined;
  }

  return value.trim();
}

function toPlayer(row: PlayerFeedRow): Player {
  return {
    id: row.player_id,
    firstName: row.first_name,
    lastName: row.last_name,
    displayName: row.display_name,
    teamId: row.team_id,
    handicap: row.handicap,
    hometown: cleanOptional(row.hometown),
    homeCourse: cleanOptional(row.home_course),
    favoriteDrink: cleanOptional(row.favorite_drink),
    walkoutMusic: cleanOptional(row.walkout_music),
    bio: cleanOptional(row.bio),
    photoPath: row.photo_key ? `/player-profiles/${row.photo_key}.webp` : undefined,
    yearsPlayed: [],
    overallRecord: {
      matchesPlayed: row.career_matches,
      wins: row.career_wins,
      losses: row.career_losses,
      halves: row.career_ties,
      pointsWon: row.career_points,
      pointsAvailable: row.career_matches,
    },
    formatRecords: [],
  };
}

export const players: Player[] = (generatedPlayers as PlayerFeedRow[])
  .filter((row) => row.active)
  .map(toPlayer);

export function getPlayerById(id: string): Player {
  const player = players.find((item) => item.id === id);

  if (!player) {
    throw new Error(`Player with ID "${id}" was not found.`);
  }

  return player;
}

export function getPlayersByTeam(teamId: TeamId): Player[] {
  return players.filter((player) => player.teamId === teamId);
}

export function getPlayerFullName(id: string): string {
  return getPlayerById(id).displayName;
}
