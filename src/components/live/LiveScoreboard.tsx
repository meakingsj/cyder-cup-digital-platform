import TeamCrest from "../common/TeamCrest";

interface LiveScoreboardProps {
  navyScore: number;
  redScore: number;
  pointsToWin: number;
  pointsRemaining: number;
}

function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function LiveScoreboard({ navyScore, redScore, pointsToWin, pointsRemaining }: LiveScoreboardProps) {
  const total = Math.max(navyScore + redScore + pointsRemaining, 1);
  const navyWidth = `${(navyScore / total) * 100}%`;
  const redWidth = `${(redScore / total) * 100}%`;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#061321]/92 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-7 sm:px-9 lg:px-12 lg:py-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <TeamCrest team="navy" imageClassName="h-16 w-16 object-contain sm:h-24 sm:w-24" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 sm:text-xs">Team Navy</p>
            <p className="mt-1 font-serif text-5xl leading-none text-white sm:text-7xl lg:text-8xl">{formatPoints(navyScore)}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-amber-300 sm:text-[11px]">Cyder Cup</p>
          <p className="mt-2 font-serif text-xl text-white sm:text-3xl">2026</p>
          <div className="mx-auto mt-3 h-px w-10 bg-amber-300/70" />
          <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">First to {formatPoints(pointsToWin)}</p>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3 text-right sm:gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 sm:text-xs">Team Red</p>
            <p className="mt-1 font-serif text-5xl leading-none text-white sm:text-7xl lg:text-8xl">{formatPoints(redScore)}</p>
          </div>
          <TeamCrest team="red" imageClassName="h-16 w-16 object-contain sm:h-24 sm:w-24" />
        </div>
      </div>

      <div className="flex h-2 bg-white/5">
        <div className="bg-[#315a86] transition-all duration-500" style={{ width: navyWidth }} />
        <div className="flex-1" />
        <div className="bg-[#b73b3b] transition-all duration-500" style={{ width: redWidth }} />
      </div>
    </section>
  );
}
