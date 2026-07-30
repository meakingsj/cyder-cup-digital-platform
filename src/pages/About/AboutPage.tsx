import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamPanel from "../../components/common/TeamPanel";

const formats = [
  {
    number: "01",
    title: "Team Scramble",
    scoring: "Gross",
    description:
      "Each team competes collectively across the front nine, back nine and overall round.",
  },
  {
    number: "02",
    title: "Four-Ball Match Play",
    scoring: "Net",
    description:
      "Two-player pairings compete for front-nine, back-nine and overall match points.",
  },
  {
    number: "03",
    title: "Singles Match Play",
    scoring: "Net",
    description:
      "Individual matches conclude the tournament, with the overall result worth two points.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Competition"
        title="About the Cyder Cup"
        description="The story, format and traditions behind the annual competition between Team Navy and Team Red."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionHeading
            eyebrow="Established 2019"
            title="A rivalry built through golf"
            description="The Cyder Cup brings together eight players across two teams for an annual three-session tournament. The first team to reach 15.5 points wins the Cup."
          />

          <ContentCard className="p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
              The Objective
            </p>

            <p className="mt-5 font-serif text-5xl text-white">
              15.5
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
              Points to win
            </p>
          </ContentCard>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <TeamPanel
            team="navy"
            description="One half of the permanent Cyder Cup rivalry."
          />

          <TeamPanel
            team="red"
            description="One half of the permanent Cyder Cup rivalry."
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#04111e]/55">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Tournament Format"
            title="Three distinct sessions"
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {formats.map((format) => (
              <ContentCard key={format.number} className="p-6">
                <div className="flex items-start justify-between gap-5">
                  <p className="text-xs font-bold tracking-[0.25em] text-amber-300">
                    {format.number}
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {format.scoring}
                  </p>
                </div>

                <h3 className="mt-6 font-serif text-2xl text-white">
                  {format.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {format.description}
                </p>
              </ContentCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}