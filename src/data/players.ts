import type { Player } from "../types";

export const players: Player[] = [];

export function getPlayerById(playerId: string): Player | undefined {
  return players.find((player) => player.id === playerId);
}