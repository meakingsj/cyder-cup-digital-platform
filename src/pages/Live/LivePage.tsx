import { useMemo, useState } from "react";
import LiveMatchCard from "../../components/live/LiveMatchCard";
import LiveScoreboard from "../../components/live/LiveScoreboard";
import {
  liveMatches,
  liveSessions,
  matchesComplete,
  matchesLive,
  navyScore,
  pointsAwarded,
  pointsRemaining,
  redScore,
  siteConfig,
} from "../../data/live";

function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function LivePage() {
  const firstActiveSession = liveSessions.find((session) => session.matches.some((match) => match.status === "live"))?.id;
  const [activeSessionId, setActiveSessionId] = useState(firstActiveSession ?? liveSessions[0]?.id ?? "session-1");
  const activeSession = liveSessions.find((session) => session.id === activeSessionId) ?? liveSessions[0];

  const progress = siteConfig.total_points_available > 0
    ? Math.min((pointsAwarded / siteConfig.total_points_available) * 100, 100)
    : 0;

  const tournamentState = useMemo(() => {
    if (!siteConfig.live_scoring_enabled) return { label: "Tournament Preview", detail: "Live scoring is currently paused." };
    if (matchesComplete === liveMatches.length && liveMatches.length > 0) return { label: "Tournament Complete", detail: "The final result is official." };
    if (matchesLive > 0) return { label: "Live Now", detail: `${matchesLive} ${matchesLive === 1 ? "match" : "matches"} currently on course.` };
    return { label: "Tournament Centre", detail: "Pairings are set for Predator Ridge." };
  }, []);

  return (
    <main>
      <section className="relative isolate min-h-[560px] overflow-hidden border-b border-white/10">
        <img src="/course/predator-ridge-aerial.jpg" alt="Predator Ridge golf course" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,11,20,.96)_0%,rgba(2,11,20,.70)_48%,rgba(2,11,20,.40)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#061626_0%,transparent_55%)]" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-5 pb-12 pt-32 sm:px-8 lg:px-10 lg:pb-16">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${matchesLive > 0 ? "animate-pulse bg-emerald-400" : "bg-amber-300"}`} />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">{tournamentState.label}</p>
            </div>
            <h1 className="font-serif text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">The 2026<br />Cyder Cup</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Predator Ridge Resort · British Columbia. Follow every session, every point and every match as Team Navy meets Team Red.</p>
            <p className="mt-3 text-sm text-slate-400">{tournamentState.detail}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-10">
        <LiveScoreboard navyScore={navyScore} redScore={redScore} pointsToWin={siteConfig.points_to_win} pointsRemaining={pointsRemaining} />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Matches Complete", `${matchesComplete} / ${liveMatches.length}`],
            ["Points Awarded", `${formatPoints(pointsAwarded)} / ${formatPoints(siteConfig.total_points_available)}`],
            ["Points Remaining", formatPoints(pointsRemaining)],
            ["Tournament Progress", `${Math.round(progress)}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-2 font-serif text-3xl text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-full bg-white/6">
          <div className="h-1.5 rounded-full bg-amber-300 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#04111e]/65">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">Session Timeline</p>
              <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">Follow the competition</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">Select a session to view pairings, status, live position and points available.</p>
          </div>

          <div className="mt-9 flex gap-2 overflow-x-auto pb-2">
            {liveSessions.map((session) => {
              const active = session.id === activeSession.id;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setActiveSessionId(session.id)}
                  className={`min-w-fit rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${active ? "border-amber-300 bg-amber-300 text-[#071521]" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white"}`}
                >
                  {session.label}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-2 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{activeSession.shortLabel}</p>
              <h3 className="mt-2 font-serif text-3xl text-white">{activeSession.label}</h3>
            </div>
            <p className="max-w-xl text-sm text-slate-400">{activeSession.description}</p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {activeSession.matches.map((match) => <LiveMatchCard key={match.id} match={match} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#081827] lg:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">Cup Watch</p>
            <h2 className="mt-4 font-serif text-4xl text-white">The road to {formatPoints(siteConfig.points_to_win)}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">The first team to reach {formatPoints(siteConfig.points_to_win)} points wins the 2026 Cyder Cup. Live results entered in the master workbook will flow into this scoreboard once the export pipeline is fully connected.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#315a86]/40 bg-[#315a86]/10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8eb2d6]">Navy Needs</p>
                <p className="mt-2 font-serif text-4xl text-white">{formatPoints(Math.max(siteConfig.points_to_win - navyScore, 0))}</p>
              </div>
              <div className="rounded-2xl border border-[#b73b3b]/40 bg-[#b73b3b]/10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e29595]">Red Needs</p>
                <p className="mt-2 font-serif text-4xl text-white">{formatPoints(Math.max(siteConfig.points_to_win - redScore, 0))}</p>
              </div>
            </div>
          </div>
          <img src="/course/predator-ridge-resort.jpg" alt="Predator Ridge resort" className="h-full min-h-72 w-full object-cover" />
        </div>
      </section>
    </main>
  );
}
