import TeamCrest from "../common/TeamCrest";

import type {
  LiveMatch,
  LiveStatus,
} from "../../data/live";

interface LiveEveningEventCardProps {
  match: LiveMatch;
}

const statusStyles: Record<
  LiveStatus,
  string
> = {
  upcoming:
    "border-slate-400/25 bg-slate-300/[0.07] text-slate-200",
  live:
    "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  complete:
    "border-amber-300/35 bg-amber-300/10 text-amber-200",
};

const statusLabels: Record<
  LiveStatus,
  string
> = {
  upcoming: "Upcoming",
  live: "Live",
  complete: "Final",
};

function formatPoints(
  value: number,
): string {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
}

function getWinnerText(
  match: LiveMatch,
): string {
  if (
    match.status !== "complete"
  ) {
    return "Team Navy vs Team Red";
  }

  if (
    match.winnerTeam === "navy"
  ) {
    return "Team Navy wins";
  }

  if (
    match.winnerTeam === "red"
  ) {
    return "Team Red wins";
  }

  if (
    match.winnerTeam === "tie"
  ) {
    return "Event tied";
  }

  return (
    match.result ??
    "Final result"
  );
}

export default function LiveEveningEventCard({
  match,
}: LiveEveningEventCardProps) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(215,177,92,0.1),transparent_45%),#081827] shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-amber-300/25">
      <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
            Evening Event{" "}
            {match.matchNumber}
          </p>

          <h3 className="mt-2 font-serif text-3xl text-white">
            {match.eventName}
          </h3>

          {match.startTime && (
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-300">
              {match.startTime}
            </p>
          )}
        </div>

        <StatusBadge
          status={match.status}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-8 sm:px-6">
        <div className="text-center">
          <TeamCrest
            team="navy"
            className="mx-auto h-20 w-20"
            imageClassName="h-full w-full object-contain"
          />

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">
            Team Navy
          </p>
        </div>

        <div className="min-w-[90px] text-center">
          <p className="font-serif text-xl text-amber-200">
            {match.status ===
            "complete"
              ? getWinnerText(
                  match,
                )
              : "VS"}
          </p>

          {match.status ===
            "complete" && (
            <div className="mt-3 flex justify-center gap-2">
              {match.navyPoints >
                0 && (
                <PointAward
                  team="navy"
                  points={
                    match.navyPoints
                  }
                />
              )}

              {match.redPoints >
                0 && (
                <PointAward
                  team="red"
                  points={
                    match.redPoints
                  }
                />
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <TeamCrest
            team="red"
            className="mx-auto h-20 w-20"
            imageClassName="h-full w-full object-contain"
          />

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-200">
            Team Red
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300 sm:px-6">
        <span>
          Evening event
        </span>

        <span>
          {formatPoints(
            match.pointsAvailable,
          )}{" "}
          {match.pointsAvailable === 1
            ? "point"
            : "points"}{" "}
          available
        </span>
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: LiveStatus;
}) {
  return (
    <span
      className={[
        "shrink-0 border px-3 py-1.5",
        "text-[10px] font-bold uppercase tracking-[0.18em]",
        statusStyles[status],
      ].join(" ")}
    >
      {status === "live" && (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}

      {statusLabels[status]}
    </span>
  );
}

function PointAward({
  team,
  points,
}: {
  team: "navy" | "red";
  points: number;
}) {
  return (
    <span
      className={[
        "border px-2 py-1",
        "text-[9px] font-bold uppercase tracking-[0.14em]",
        team === "navy"
          ? "border-sky-300/25 bg-sky-300/10 text-sky-200"
          : "border-red-300/25 bg-red-300/10 text-red-200",
      ].join(" ")}
    >
      +{formatPoints(points)}
    </span>
  );
}