import teamNavyLogo from "../../assets/teams/team-navy.png";
import teamRedLogo from "../../assets/teams/team-red.png";
import type { TeamId } from "../../types";

interface TeamCrestProps {
  team: TeamId;
  className?: string;
  imageClassName?: string;
}

const teamDetails = {
  navy: {
    name: "Team Navy",
    logo: teamNavyLogo,
  },
  red: {
    name: "Team Red",
    logo: teamRedLogo,
  },
};

export default function TeamCrest({
  team,
  className = "",
  imageClassName = "",
}: TeamCrestProps) {
  const details = teamDetails[team];

  return (
    <div className={className}>
      <img
        src={details.logo}
        alt={`${details.name} logo`}
        className={imageClassName}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}