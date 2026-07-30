import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamPanel from "../../components/common/TeamPanel";

const sessions = [
  {
    number: "01",
    title: "Team Scramble",
    format: "Gross stroke play",
    points: "Front 9 · Back 9 · Overall",
  },
  {
    number: "02",
    title: "Four-Ball Match Play",
    format: "Net team matches",
    points: "Front 9 · Back 9 · Overall",
  },
  {
    number: "03",
    title: "Singles Match Play",
    format: "Net individual matches",
    points: "Front 9 · Back 9 · Overall",
  },
];

export default function LivePage() {
  return (
    <>
      <PageIntro
        eyebrow="2026 Tournament"
        title="Live Event"
        description="The current Cyder Cup schedule, session results, match status and tournament standings."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Tournament Centre"
          title="Team Navy versus Team Red"
          description="Eight competitors will contest three sessions at Predator Ridge in British Columbia."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <TeamPanel
            team="navy"
            title="Team Navy"
            description="Current roster, match pairings and tournament points will appear here."
          />

          <TeamPanel
            team="red"
            title="Team Red"
            description="Current roster, match pairings and tournament points will appear here."
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#04111e]/55">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Competition Format"
            title="Three sessions decide the Cup"
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {sessions.map((session) => (
              <ContentCard key={session.number} className="p-6">
                <p className="text-xs font-bold tracking-[0.25em] text-amber-300">
                  {session.number}
                </p>

                <h3 className="mt-5 font-serif text-2xl text-white">
                  {session.title}
                </h3>

                <p className="mt-3 text-sm text-slate-300">
                  {session.format}
                </p>

                <p className="mt-5 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {session.points}
                </p>
              </ContentCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}