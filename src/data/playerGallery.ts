import generatedGallery from "./generated/player-gallery.json";

export interface PlayerGalleryImage {
  year: number;
  path: string;
  players: string[];
  tags: string[];
  teamTags: string[];
}

export const playerGallery = generatedGallery as PlayerGalleryImage[];

export function getPlayerGallery(playerId: string): PlayerGalleryImage[] {
  return playerGallery
    .filter((image) => image.players.includes(playerId))
    .sort((a, b) => b.year - a.year || a.path.localeCompare(b.path));
}
