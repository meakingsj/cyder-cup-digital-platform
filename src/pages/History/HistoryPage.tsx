import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";

const tournamentYears = ["2025", "2024", "2023", "2022", "2021", "2019"];

export default function HistoryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Since 2019"
        title="Tournament History"
        description="Explore every Cyder Cup through its venue, team rosters, match results, awards, photographs and defining moments."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="The Archive"
          title="Every edition of the Cyder Cup"
          description="Historical tournament data will be added from the official Cyder Cup records."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tournamentYears.map((year) => (
            <ContentCard
              key={year}
              hover
              className="group flex min-h-56 flex-col justify-between p-6"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
                  Cyder Cup
                </p>

                <h2 className="mt-4 font-serif text-5xl text-white">
                  {year}
                </h2>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  View Tournament
                </p>

                <span className="text-xl text-amber-300 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </ContentCard>
          ))}
        </div>
      </section>
    </>
  );
}