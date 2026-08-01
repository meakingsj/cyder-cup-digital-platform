import pageMediaData from "./generated/page-media.json";

export type PageMediaPageId =
  | "home"
  | "history"
  | "player-profile"
  | "gallery"
  | "teams"
  | "players"
  | "about"
  | "live"
  | "records";

export interface PageMediaItem {
  media_id: string;

  year?: number | null;
  sequence?: number | null;

  file_name: string;
  file_path: string;

  subjects?: string | null;
  activity?: string | null;
  file_type?: string | null;
  file_size_kb?: number | null;

  page_id?: PageMediaPageId | string | null;
  section_id?: string | null;
  scope_id?: string | number | null;

  display_order?: number | null;
  priority?: number | null;

  alt_text?: string | null;
  caption?: string | null;

  featured?: boolean | null;
  active?: boolean | null;

  object_position?: string | null;
  notes?: string | null;
}

export const pageMedia =
  pageMediaData as PageMediaItem[];

function normalizedText(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
}

function numericSortValue(
  value: number | null | undefined,
): number {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return value;
}

function sortPageMedia(
  items: PageMediaItem[],
): PageMediaItem[] {
  return [...items].sort((a, b) => {
    const priorityDifference =
      numericSortValue(a.priority) -
      numericSortValue(b.priority);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const orderDifference =
      numericSortValue(a.display_order) -
      numericSortValue(b.display_order);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    const yearDifference =
      numericSortValue(a.year) -
      numericSortValue(b.year);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    return a.file_name.localeCompare(
      b.file_name,
    );
  });
}

function isActive(
  item: PageMediaItem,
): boolean {
  return item.active !== false;
}

export function getPageMedia(
  pageId: PageMediaPageId,
  sectionId: string,
  scopeId?: string | number,
): PageMediaItem[] {
  const normalizedPageId =
    normalizedText(pageId);

  const normalizedSectionId =
    normalizedText(sectionId);

  const normalizedScopeId =
    normalizedText(scopeId);

  const matches = pageMedia.filter(
    (item) => {
      if (!isActive(item)) {
        return false;
      }

      if (
        normalizedText(item.page_id) !==
        normalizedPageId
      ) {
        return false;
      }

      if (
        normalizedText(item.section_id) !==
        normalizedSectionId
      ) {
        return false;
      }

      if (
        scopeId !== undefined &&
        normalizedText(item.scope_id) !==
          normalizedScopeId
      ) {
        return false;
      }

      return true;
    },
  );

  return sortPageMedia(matches);
}

export function getFeaturedPageMedia(
  pageId: PageMediaPageId,
  sectionId: string,
  scopeId?: string | number,
): PageMediaItem | undefined {
  const sectionMedia = getPageMedia(
    pageId,
    sectionId,
    scopeId,
  );

  return (
    sectionMedia.find(
      (item) =>
        item.featured === true,
    ) ?? sectionMedia[0]
  );
}

export function getHomeFeaturedStory():
  | PageMediaItem
  | undefined {
  return getFeaturedPageMedia(
    "home",
    "featured-story",
  );
}

export function getHomeGalleryPreview():
  PageMediaItem[] {
  return getPageMedia(
    "home",
    "gallery-preview",
  );
}

export function getHistoryMedia(
  year: number,
): PageMediaItem[] {
  return getPageMedia(
    "history",
    "tournament-gallery",
    year,
  );
}

export function getHistoryFeaturedMedia(
  year: number,
): PageMediaItem | undefined {
  return getFeaturedPageMedia(
    "history",
    "tournament-gallery",
    year,
  );
}

export function getHistoryGalleryMedia(
  year: number,
): PageMediaItem[] {
  const media = getHistoryMedia(year);

  const featured =
    getHistoryFeaturedMedia(year);

  if (!featured) {
    return media;
  }

  let featuredRemoved = false;

  return media.filter((item) => {
    if (
      !featuredRemoved &&
      item.media_id === featured.media_id &&
      item.file_path === featured.file_path
    ) {
      featuredRemoved = true;
      return false;
    }

    return true;
  });
}

export function getPlayerProfileMedia(
  playerId: string,
): PageMediaItem[] {
  return getPageMedia(
    "player-profile",
    "gallery",
    playerId,
  );
}

export function getGalleryMedia(
  year?: number,
): PageMediaItem[] {
  const media = pageMedia.filter(
    (item) => {
      if (!isActive(item)) {
        return false;
      }

      if (
        normalizedText(item.page_id) !==
        "gallery"
      ) {
        return false;
      }

      if (
        year !== undefined &&
        item.year !== year
      ) {
        return false;
      }

      return true;
    },
  );

  return sortPageMedia(media);
}

export function getMediaById(
  mediaId: string,
): PageMediaItem[] {
  const normalizedMediaId =
    normalizedText(mediaId);

  return sortPageMedia(
    pageMedia.filter(
      (item) =>
        normalizedText(item.media_id) ===
        normalizedMediaId,
    ),
  );
}

export function getMediaAltText(
  item: PageMediaItem,
  fallback = "Cyder Cup tournament photograph",
): string {
  const altText =
    item.alt_text?.trim();

  if (altText) {
    return altText;
  }

  const caption =
    item.caption?.trim();

  if (caption) {
    return caption;
  }

  if (item.year) {
    return `${item.year} Cyder Cup tournament photograph`;
  }

  return fallback;
}

export function getMediaObjectPosition(
  item: PageMediaItem,
): string {
  return (
    item.object_position?.trim() ||
    "center"
  );
}