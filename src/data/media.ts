import mediaData from "./generated/media.json";

export type MediaAssetType = "photo" | "video";

export type MediaScopeType =
  | "player"
  | "team"
  | "tournament"
  | "site";

export interface MediaRecord {
  media_id: string;
  asset_type: MediaAssetType;
  scope_type: MediaScopeType;
  scope_id: string;

  year?: number | null;
  file_key: string;
  role?: string | null;
  caption?: string | null;
  sort_order?: number | null;
  active?: boolean | null;
}

export const media = (
  mediaData as MediaRecord[]
)
  .filter((item) => item.active !== false)
  .sort(
    (a, b) =>
      (a.sort_order ?? 999) -
      (b.sort_order ?? 999),
  );

export function getMediaByScope(
  scopeType: MediaScopeType,
  scopeId: string,
): MediaRecord[] {
  return media.filter(
    (item) =>
      item.scope_type === scopeType &&
      item.scope_id === scopeId,
  );
}

export function getPlayerMedia(
  playerId: string,
): MediaRecord[] {
  return getMediaByScope("player", playerId);
}

export function getTournamentMedia(
  tournamentId: string,
): MediaRecord[] {
  return getMediaByScope(
    "tournament",
    tournamentId,
  );
}

export function getPrimaryMedia(
  scopeType: MediaScopeType,
  scopeId: string,
  role = "profile",
): MediaRecord | undefined {
  return media.find(
    (item) =>
      item.scope_type === scopeType &&
      item.scope_id === scopeId &&
      item.role === role,
  );
}