export type RecordCategory =
  | "career-points"
  | "singles-record"
  | "four-ball-record"
  | "scramble-record"
  | "head-to-head"
  | "longest-unbeaten-streak"
  | "team-chemistry";

export interface RecordEntry {
  id: string;
  category: RecordCategory;
  title: string;
  playerIds: string[];
  value: string;
  numericValue?: number;
  description?: string;
  asOfYear: number;
}