import type { ReactNode } from "react";
import {
  useMemo,
  useState,
} from "react";

import TeamCrest from "../../components/common/TeamCrest";
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
  type LiveSession,
  type LiveSessionId,
} from "../../data/live";

type WinningTeam =
  | "navy"
  | "red"
  | "tie"
  | undefined;

function formatPoints(
  value: number,
): string {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function getTournamentWinner():
  WinningTeam {
  if (
    navyScore >=
      siteConfig.points_to_win &&
    navyScore > redScore
  ) {
    return "navy";
  }

  if (
    redScore >=
      siteConfig.points_to_win &&
    redScore > navyScore
  ) {
    return "red";
  }

  if (
    liveMatches.length > 0 &&
    matchesComplete ===
      liveMatches.length
  ) {
    if (navyScore > redScore) {
      return "navy";
    }

    if (redScore > navyScore) {
      return "red";
    }

    return "tie";
  }

  return undefined;
}

function getInitialSessionId():
  LiveSessionId {
  const liveSession =
    liveSessions.find(
      (session) =>
        session.status === "live",
    );

  if (liveSession) {
    return liveSession.id;
  }

  const nextSession =
    liveSessions.find(
      (session) =>
        session.status ===
        "upcoming",
    );

  return (
    nextSession?.id ??
    liveSessions[0]?.id ??
    "scramble"
  );
}

export default function LivePage() {
  const [
    activeSessionId,
    setActiveSessionId,
  ] =
    useState<LiveSessionId>(
      getInitialSessionId,
    );

  const activeSession =
    liveSessions.find(
      (session) =>
        session.id ===
        activeSessionId,
    ) ?? liveSessions[0];

  const progress =
    siteConfig.total_points_available >
    0
      ? Math.min(
          (pointsAwarded /
            siteConfig.total_points_available) *
            100,
          100,
        )
      : 0;

  const tournamentWinner =
    getTournamentWinner();

  const tournamentState =
    useMemo(() => {
      if (tournamentWinner) {
        return {
          label:
            tournamentWinner ===
            "tie"
              ? "Tournament Complete"
              : "2026 Cyder Cup Champions",
          detail:
            tournamentWinner ===
            "tie"
              ? "The final result is level."
              : `Team ${
                  tournamentWinner ===
                  "navy"
                    ? "Navy"
                    : "Red"
                } has secured the Cup.`,
        };
      }

      if (
        !siteConfig.live_scoring_enabled
      ) {
        return {
          label:
            "Tournament Preview",
          detail:
            "Pairings and tee times are set for Predator Ridge.",
        };
      }

      if (matchesLive > 0) {
        return {
          label: "Live Now",
          detail: `${matchesLive} ${
            matchesLive === 1
              ? "match is"
              : "matches are"
          } currently in progress.`,
        };
      }

      if (
        matchesComplete > 0
      ) {
        return {
          label:
            "Tournament Centre",
          detail: `${matchesComplete} of ${liveMatches.length} matches complete.`,
        };
      }

      return {
        label:
          "Tournament Centre",
        detail:
          "The 2026 Cyder Cup begins at Predator Ridge.",
      };
    }, [tournamentWinner]);

  return (
    <main className="overflow-hidden bg-[#061626] text-white">
      <TournamentHero
        tournamentWinner={
          tournamentWinner
        }
        stateLabel={
          tournamentState.label
        }
        stateDetail={
          tournamentState.detail
        }
      />

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 sm:px-8 lg:px-10">
        <LiveScoreboard
          navyScore={navyScore}
          redScore={redScore}
          pointsToWin={
            siteConfig.points_to_win
          }
          pointsRemaining={
            pointsRemaining
          }
        />
      </section>

      <TournamentProgress
        progress={progress}
      />

      <section className="border-y border-white/10 bg-[#04111e]/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>
                Session timeline
              </SectionLabel>

              <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl lg:text-6xl">
                Follow the weekend.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Select a session to view
              pairings, tee times, live
              positions, completed results
              and points earned.
            </p>
          </div>

          <SessionNavigation
            sessions={liveSessions}
            activeSessionId={
              activeSession?.id
            }
            onSelect={
              setActiveSessionId
            }
          />

          {activeSession ? (
            <SessionPanel
              session={
                activeSession
              }
            />
          ) : (
            <div className="mt-10 border border-white/10 bg-[#071827] p-8 text-slate-300">
              Tournament sessions are
              not yet available.
            </div>
          )}
        </div>
      </section>

      <CupWatch
        tournamentWinner={
          tournamentWinner
        }
      />
    </main>
  );
}

function TournamentHero({
  tournamentWinner,
  stateLabel,
  stateDetail,
}: {
  tournamentWinner:
    | WinningTeam;
  stateLabel: string;
  stateDetail: string;
}) {
  const championTeam =
    tournamentWinner === "navy" ||
    tournamentWinner === "red"
      ? tournamentWinner
      : undefined;

  return (
    <section className="relative isolate min-h-[620px] overflow-hidden border-b border-white/10">
      <img
        src="/course/predator-ridge-aerial.jpg"
        alt="Predator Ridge golf course"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,11,20,.97)_0%,rgba(2,11,20,.78)_47%,rgba(2,11,20,.46)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(0deg,#061626_0%,transparent_58%)]" />

      <div
        className="home-grain absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pb-20">
        {championTeam ? (
          <div className="flex max-w-4xl flex-col items-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-amber-300" />

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
                {stateLabel}
              </p>
            </div>

            <div className="mt-8 flex flex-col items-start gap-7 sm:flex-row sm:items-center">
              <TeamCrest
                team={
                  championTeam
                }
                className="h-32 w-32 shrink-0 sm:h-40 sm:w-40"
                imageClassName="h-full w-full object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,.55)]"
              />

              <div>
                <h1 className="font-serif text-6xl leading-[0.9] text-white sm:text-7xl lg:text-8xl">
                  Team{" "}
                  {championTeam ===
                  "navy"
                    ? "Navy"
                    : "Red"}
                </h1>

                <p className="mt-5 font-serif text-3xl text-amber-200 sm:text-4xl">
                  {formatPoints(
                    navyScore,
                  )}
                  <span className="mx-4 text-white/35">
                    —
                  </span>
                  {formatPoints(
                    redScore,
                  )}
                </p>
              </div>
            </div>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {stateDetail}
            </p>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  matchesLive > 0
                    ? "animate-pulse bg-emerald-400"
                    : "bg-amber-300",
                ].join(" ")}
              />

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
                {stateLabel}
              </p>
            </div>

            <h1 className="font-serif text-6xl leading-[0.9] text-white sm:text-7xl lg:text-8xl">
              The 2026
              <br />
              Cyder Cup
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Predator Ridge Resort ·
              Vernon, British Columbia.
              Follow every session, every
              point and every match as Team
              Navy meets Team Red.
            </p>

            <p className="mt-4 text-sm text-slate-300">
              {stateDetail}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function TournamentProgress({
  progress,
}: {
  progress: number;
}) {
  const metrics = [
    {
      label:
        "Matches complete",
      value: `${matchesComplete} / ${liveMatches.length}`,
    },
    {
      label:
        "Points awarded",
      value: `${formatPoints(
        pointsAwarded,
      )} / ${formatPoints(
        siteConfig.total_points_available,
      )}`,
    },
    {
      label:
        "Points remaining",
      value:
        formatPoints(
          pointsRemaining,
        ),
    },
    {
      label:
        "Tournament progress",
      value: `${Math.round(
        progress,
      )}%`,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
      <div className="grid overflow-hidden border border-white/10 bg-[#071827] sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(
          (metric) => (
            <div
              key={metric.label}
              className="border-b border-white/10 px-6 py-6 last:border-b-0 sm:border-r lg:border-b-0"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                {metric.label}
              </p>

              <p className="mt-3 font-serif text-3xl text-white">
                {metric.value}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="mt-5 h-1.5 overflow-hidden bg-white/[0.07]">
        <div
          className="h-full bg-amber-300 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </section>
  );
}

function SessionNavigation({
  sessions,
  activeSessionId,
  onSelect,
}: {
  sessions: LiveSession[];
  activeSessionId?:
    LiveSessionId;
  onSelect: (
    sessionId: LiveSessionId,
  ) => void;
}) {
  return (
    <div className="mt-12 grid overflow-hidden border border-white/10 md:grid-cols-2 xl:grid-cols-4">
      {sessions.map(
        (
          session,
          index,
        ) => {
          const active =
            session.id ===
            activeSessionId;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() =>
                onSelect(
                  session.id,
                )
              }
              className={[
                "group relative min-h-40",
                "border-b border-white/10",
                "px-6 py-6 text-left",
                "transition duration-300",
                "md:border-r",
                index ===
                sessions.length - 1
                  ? "border-b-0 md:border-r-0"
                  : "",
                active
                  ? "bg-amber-300 text-[#061626]"
                  : "bg-[#071827] text-white hover:bg-[#0a2034]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <p
                  className={[
                    "text-[10px] font-bold uppercase tracking-[0.24em]",
                    active
                      ? "text-[#061626]/65"
                      : "text-slate-300",
                  ].join(" ")}
                >
                  {session.shortLabel}
                </p>

                <SessionStatusDot
                  status={
                    session.status
                  }
                  active={active}
                />
              </div>

              <p className="mt-6 font-serif text-3xl">
                {session.label}
              </p>

              <p
                className={[
                  "mt-3 text-[10px] font-bold uppercase tracking-[0.17em]",
                  active
                    ? "text-[#061626]/70"
                    : "text-amber-300",
                ].join(" ")}
              >
                {
                  session.scheduleLabel
                }
              </p>

              {active && (
                <span className="absolute inset-x-0 bottom-0 h-1 bg-[#061626]" />
              )}
            </button>
          );
        },
      )}
    </div>
  );
}

function SessionStatusDot({
  status,
  active,
}: {
  status:
    | "upcoming"
    | "live"
    | "complete";
  active: boolean;
}) {
  const classes =
    status === "complete"
      ? active
        ? "bg-[#061626]"
        : "bg-amber-300"
      : status === "live"
        ? active
          ? "animate-pulse bg-emerald-700"
          : "animate-pulse bg-emerald-400"
        : active
          ? "border border-[#061626]/60"
          : "border border-white/35";

  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${classes}`}
      aria-hidden="true"
    />
  );
}

function SessionPanel({
  session,
}: {
  session: LiveSession;
}) {
  return (
    <div className="mt-10">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
            {session.shortLabel} ·{" "}
            {session.scheduleLabel}
          </p>

          <h3 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            {session.label}
          </h3>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            {session.description}
          </p>
        </div>

        <SessionScore
          session={session}
        />
      </div>

      {session.status ===
        "complete" && (
        <SessionWinnerBanner
          session={session}
        />
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {session.matches.map(
          (match) => (
            <LiveMatchCard
              key={match.id}
              match={match}
            />
          ),
        )}
      </div>
    </div>
  );
}

function SessionScore({
  session,
}: {
  session: LiveSession;
}) {
  return (
    <div className="flex items-center gap-5 border border-white/10 bg-[#071827] px-6 py-4">
      <div className="text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-200">
          Navy
        </p>

        <p className="mt-1 font-serif text-3xl">
          {formatPoints(
            session.navyPoints,
          )}
        </p>
      </div>

      <span className="text-white/25">
        —
      </span>

      <div className="text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-200">
          Red
        </p>

        <p className="mt-1 font-serif text-3xl">
          {formatPoints(
            session.redPoints,
          )}
        </p>
      </div>

      <div className="ml-2 border-l border-white/10 pl-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300">
          Awarded
        </p>

        <p className="mt-1 text-sm text-white">
          {formatPoints(
            session.pointsAwarded,
          )}{" "}
          /{" "}
          {formatPoints(
            session.pointsAvailable,
          )}
        </p>
      </div>
    </div>
  );
}

function SessionWinnerBanner({
  session,
}: {
  session: LiveSession;
}) {
  const winner =
    session.winnerTeam;

  return (
    <div
      className={[
        "mt-8 flex flex-col items-center justify-center",
        "border px-6 py-8 text-center",
        winner === "navy"
          ? "border-sky-300/25 bg-sky-300/[0.08]"
          : winner === "red"
            ? "border-red-300/25 bg-red-300/[0.08]"
            : "border-amber-300/25 bg-amber-300/[0.08]",
      ].join(" ")}
    >
      {winner === "navy" ||
      winner === "red" ? (
        <>
          <TeamCrest
            team={winner}
            className="h-20 w-20"
            imageClassName="h-full w-full object-contain"
          />

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.26em] text-amber-300">
            Session complete
          </p>

          <p className="mt-3 font-serif text-4xl text-white">
            Team{" "}
            {winner === "navy"
              ? "Navy"
              : "Red"}{" "}
            wins {session.label}
          </p>
        </>
      ) : (
        <>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-amber-300">
            Session complete
          </p>

          <p className="mt-3 font-serif text-4xl text-white">
            {session.label} ends level
          </p>
        </>
      )}

      <p className="mt-4 font-serif text-2xl text-white/80">
        {formatPoints(
          session.navyPoints,
        )}
        <span className="mx-3 text-white/25">
          —
        </span>
        {formatPoints(
          session.redPoints,
        )}
      </p>
    </div>
  );
}

function CupWatch({
  tournamentWinner,
}: {
  tournamentWinner:
    | WinningTeam;
}) {
  const navyNeeds =
    Math.max(
      siteConfig.points_to_win -
        navyScore,
      0,
    );

  const redNeeds =
    Math.max(
      siteConfig.points_to_win -
        redScore,
      0,
    );

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="grid overflow-hidden border border-white/10 bg-[#081827] lg:grid-cols-[1.1fr_.9fr]">
        <div className="p-8 sm:p-10 lg:p-12">
          <SectionLabel>
            Cup watch
          </SectionLabel>

          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            {tournamentWinner
              ? "The final result."
              : `The road to ${formatPoints(
                  siteConfig.points_to_win,
                )}.`}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
            {tournamentWinner
              ? tournamentWinner ===
                "tie"
                ? "The competition has ended level."
                : `Team ${
                    tournamentWinner ===
                    "navy"
                      ? "Navy"
                      : "Red"
                  } has reached the winning total and secured the 2026 Cyder Cup.`
              : `The first team to reach ${formatPoints(
                  siteConfig.points_to_win,
                )} points wins the 2026 Cyder Cup.`}
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <NeedCard
              team="navy"
              value={
                tournamentWinner
                  ? navyScore
                  : navyNeeds
              }
              label={
                tournamentWinner
                  ? "Final points"
                  : "Navy needs"
              }
            />

            <NeedCard
              team="red"
              value={
                tournamentWinner
                  ? redScore
                  : redNeeds
              }
              label={
                tournamentWinner
                  ? "Final points"
                  : "Red needs"
              }
            />
          </div>
        </div>

        <img
          src="/course/predator-ridge-resort.jpg"
          alt="Predator Ridge Resort"
          className="h-full min-h-80 w-full object-cover"
        />
      </div>
    </section>
  );
}

function NeedCard({
  team,
  value,
  label,
}: {
  team: "navy" | "red";
  value: number;
  label: string;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 border p-5",
        team === "navy"
          ? "border-sky-300/25 bg-sky-300/[0.07]"
          : "border-red-300/25 bg-red-300/[0.07]",
      ].join(" ")}
    >
      <div>
        <p
          className={[
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            team === "navy"
              ? "text-sky-200"
              : "text-red-200",
          ].join(" ")}
        >
          {label}
        </p>

        <p className="mt-2 font-serif text-4xl text-white">
          {formatPoints(value)}
        </p>
      </div>

      <TeamCrest
        team={team}
        className="h-16 w-16"
        imageClassName="h-full w-full object-contain"
      />
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300">
      {children}
    </p>
  );
}