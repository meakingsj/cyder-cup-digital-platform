import TeamCrest from "../common/TeamCrest";
import type { TeamAnalytics } from "../../analytics";

function formatPoints(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#071827]/75 px-4 py-5">
      <p className="font-serif text-2xl text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default function TeamHero({
  team,
}: {
  team: TeamAnalytics;
}) {
  const navy =
    team.teamId === "navy";

  return (
    <section
      className={`relative overflow-hidden border border-white/10 ${
        navy
          ? "bg-[radial-gradient(circle_at_top_left,#173d62_0%,#071827_42%,#04111e_100%)]"
          : "bg-[radial-gradient(circle_at_top_right,#6b1d24_0%,#271018_42%,#04111e_100%)]"
      }`}
    >
      <div className="grid items-center gap-10 px-8 py-16 lg:grid-cols-[1fr_auto]">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.32em] ${
              navy
                ? "text-blue-300"
                : "text-red-300"
            }`}
          >
            Team Profile
          </p>

          <h1 className="mt-5 font-serif text-6xl text-white">
            {team.teamId === "navy"
              ? "Team Navy"
              : "Team Red"}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Built through years of rivalry,
            partnerships and unforgettable
            moments. Every point earned has
            shaped the identity of this team.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden bg-white/10 lg:grid-cols-4">
            <HeroMetric
              label="Career Points"
              value={formatPoints(
                team.points,
              )}
            />

            <HeroMetric
              label="Record"
              value={`${team.wins}-${team.losses}-${team.ties}`}
            />

            <HeroMetric
              label="Win Rate"
              value={`${formatPoints(
                team.winPercentage,
              )}%`}
            />

            <HeroMetric
              label="Appearances"
              value={
                team.years.length
              }
            />
          </div>
        </div>

        <TeamCrest
          team={team.teamId}
          className="mx-auto h-56 w-56"
          imageClassName="h-full w-full object-contain"
        />
      </div>
    </section>
  );
}