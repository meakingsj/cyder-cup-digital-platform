import type { Tournament } from "../types";

export const tournaments: Tournament[] = [
  {
    year: 2026,
    name: "2026 Cyder Cup",
    venue: {
      name: "Predator Ridge Resort",
      city: "Vernon",
      region: "British Columbia",
      country: "Canada",
    },
    playerIds: [],
    matches: [],
    awards: [],
    photos: [],
    isComplete: false,
  },
];

export function getTournamentByYear(
  year: number,
): Tournament | undefined {
  return tournaments.find((tournament) => tournament.year === year);
}

export function getCurrentTournament(): Tournament | undefined {
  return [...tournaments]
    .sort((a, b) => b.year - a.year)
    .find((tournament) => !tournament.isComplete);
}