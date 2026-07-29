export type TeamId = "navy" | "red";

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  color: string;
}