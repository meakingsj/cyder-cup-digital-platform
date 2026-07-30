import type { LiveMatch } from "../../data/live";

interface LiveMatchCardProps {
  match: LiveMatch;
}

const statusStyles = {
  upcoming: "border-slate-500/20 bg-slate-400/10 text-slate-300",
  live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  complete: "border-amber-300/25 bg-amber-300/10 text-amber-200",
};

const statusLabels = {
  upcoming: "Upcoming",
  live: "Live",
  complete: "Final",
};

function compactTeam(names: string[]): string[] {
  if (names.length <= 2) return names;
  return ["Full Team"];
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  const navyNames = compactTeam(match.navyNames);
  const redNames = compactTeam(match.redNames);
  const centerScore = match.result || match.displayScore || (match.status === "upcoming" ? "vs" : "All Square");

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#081827]/85 shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Match {match.matchNumber}</p>
          <h3 className="mt-1 text-sm font-semibold text-white sm:text-base">{match.eventName}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusStyles[match.status]}`}>
          {match.status === "live" && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
          {statusLabels[match.status]}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-7 sm:px-6">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7ea2c8]">Team Navy</p>
          <div className="space-y-1.5">
            {navyNames.map((name) => <p key={name} className="font-serif text-lg leading-tight text-white sm:text-xl">{name}</p>)}
          </div>
        </div>

        <div className="min-w-20 text-center sm:min-w-28">
          <p className="font-serif text-xl text-amber-200 sm:text-2xl">{centerScore}</p>
          {match.currentHole && <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Hole {match.currentHole}</p>}
          {match.startTime && match.status === "upcoming" && <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">{match.startTime}</p>}
        </div>

        <div className="text-right">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#db7d7d]">Team Red</p>
          <div className="space-y-1.5">
            {redNames.map((name) => <p key={name} className="font-serif text-lg leading-tight text-white sm:text-xl">{name}</p>)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.025] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:px-6">
        <span>{match.format.replaceAll("-", " ")}</span>
        <span>{match.pointsAvailable} points available</span>
      </div>
    </article>
  );
}
