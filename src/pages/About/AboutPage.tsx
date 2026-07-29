import PageIntro from "../../components/common/PageIntro";

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Competition"
        title="About the Cyder Cup"
        description="The story, format and traditions behind the annual competition between Team Navy and Team Red."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
            Established 2019
          </p>

          <h2 className="mt-4 font-serif text-4xl text-white">
            Three sessions decide the Cup.
          </h2>

          <p className="mt-6 max-w-3xl leading-7 text-slate-300">
            The Cyder Cup brings together eight players across two permanent
            teams. Competition includes gross team scramble, net four-ball match
            play and net singles match play. The first team to reach 15.5 points
            wins the Cup.
          </p>
        </div>

        <div className="rounded-sm border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Competition Format
          </p>

          <ol className="mt-6 space-y-5">
            <li>
              <p className="font-serif text-xl text-white">01. Team Scramble</p>
              <p className="mt-1 text-sm text-slate-400">Gross stroke play</p>
            </li>
            <li>
              <p className="font-serif text-xl text-white">
                02. Four-Ball Match Play
              </p>
              <p className="mt-1 text-sm text-slate-400">Net team matches</p>
            </li>
            <li>
              <p className="font-serif text-xl text-white">
                03. Singles Match Play
              </p>
              <p className="mt-1 text-sm text-slate-400">Net individual matches</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}