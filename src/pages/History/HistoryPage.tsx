import PageIntro from "../../components/common/PageIntro";

export default function HistoryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Since 2019"
        title="Tournament History"
        description="Explore every Cyder Cup through its venue, team rosters, match results, awards, photographs and defining moments."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          {["2025", "2024", "2023", "2022", "2021", "2019"].map((year) => (
            <article
              key={year}
              className="group flex min-h-40 items-end justify-between rounded-sm border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-300/40 hover:bg-white/[0.05]"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Cyder Cup
                </p>
                <h2 className="mt-2 font-serif text-4xl text-white">{year}</h2>
              </div>

              <span className="text-2xl text-amber-300 transition-transform group-hover:translate-x-1">
                →
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}