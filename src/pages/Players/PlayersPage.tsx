import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamCrest from "../../components/common/TeamCrest";
import PlayerCard from "../../components/players/PlayerCard";
import { getPlayersByTeam } from "../../data";
import type { TeamId } from "../../types";

const teamDetails: Record<
  TeamId,
  { eyebrow: string; title: string; description: string }
> = {
  navy: {
    eyebrow: "Defending Champions",
    title: "Team Navy",
    description:
      "Three-time champions and the holders of the Cyder Cup entering Predator Ridge.",
  },
  red: {
    eyebrow: "The Challengers",
    title: "Team Red",
    description:
      "Two-time champions looking to reclaim the Cup in Vernon in 2026.",
  },
};

export default function PlayersPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Competitors"
        title="Player Directory"
        description="Meet the eight players competing for the Cyder Cup, with profiles and career records powered directly by the master databook."
      />

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="2026 Field"
          title="Eight players. Two teams. One Cup."
          description="Career records shown below include every completed Cyder Cup from 2019 through 2025."
        />

        <div className="mt-14 space-y-20">
          <TeamRoster team="navy" />
          <TeamRoster team="red" />
        </div>
      </main>
    </>
  );
}

function TeamRoster({ team }: { team: TeamId }) {
  const details = teamDetails[team];
  const players = getPlayersByTeam(team);

  return (
    <section>
      <div className="mb-7 flex items-center gap-5 border-b border-white/10 pb-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#071827] p-2.5">
          <TeamCrest
            team={team}
            className="flex h-full w-full items-center justify-center"
            imageClassName="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">
            {details.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-4xl text-white">{details.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {details.description}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
