import teamNavyLogo from "../assets/teams/team-navy.png";
import teamRedLogo from "../assets/teams/team-red.png";
import type { Team, TeamId } from "../types";

export const teams: Team[] = [
  {
    id: "navy",
    name: "Team Navy",
    shortName: "Navy",
    abbreviation: "NAV",
    color: "#0B2A4A",
    secondaryColor: "#D4AF37",
    logoPath: teamNavyLogo,
  },
  {
    id: "red",
    name: "Team Red",
    shortName: "Red",
    abbreviation: "RED",
    color: "#B91C1C",
    secondaryColor: "#D4AF37",
    logoPath: teamRedLogo,
  },
];

export const teamNavy = teams.find(
  (team) => team.id === "navy",
) as Team;

export const teamRed = teams.find(
  (team) => team.id === "red",
) as Team;

export function getTeamById(teamId: TeamId): Team {
  const team = teams.find((item) => item.id === teamId);

  if (!team) {
    throw new Error(`Team with ID "${teamId}" was not found.`);
  }

  return team;
}