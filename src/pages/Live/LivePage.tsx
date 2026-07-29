import PageIntro from "../../components/common/PageIntro";

export default function LivePage() {
  return (
    <>
      <PageIntro
        eyebrow="2026 Tournament"
        title="Live Event"
        description="The home of the current Cyder Cup schedule, session results, match status and tournament standings."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-sm border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
            Event Centre
          </p>
          <h2 className="mt-4 font-serif text-3xl text-white">
            2026 tournament information is coming next.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            This page will contain the countdown, session schedule, live team
            score, match results and course information.
          </p>
        </div>
      </section>
    </>
  );
}