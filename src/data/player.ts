import type { Player, TeamId } from "../types";

export const players: Player[] = [];

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