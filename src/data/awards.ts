import awardsData from "./generated/awards.json";

export interface AwardRecord {
  award_id: string;
  tournament_id: string;
  year: number;
  award_title: string;

  player_id?: string | null;
  team_id?: string | null;

  description?: string | null;
  sort_order?: number | null;
  active?: boolean | null;
}

export const awards = awardsData as AwardRecord[];

export function getAwardsByPlayer(
  playerId: string,
): AwardRecord[] {
  return awards.filter(
    (award) => award.player_id === playerId,
  );
}

export function getAwardsByTournament(
  tournamentId: string,
): AwardRecord[] {
  return awards.filter(
    (award) => award.tournament_id === tournamentId,
  );
}

export function getAwardsByYear(
  year: number,
): AwardRecord[] {
  return awards.filter(
    (award) => award.year === year,
  );
}