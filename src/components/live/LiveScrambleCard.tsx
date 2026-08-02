import TeamCrest from "../common/TeamCrest";

import type {
  LiveMatch,
  LiveStatus,
} from "../../data/live";

interface LiveScrambleCardProps {
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

export default function LiveScrambleCard({
  match,
}: LiveScrambleCardProps) {
  const team =
    match.navyFullTeam
      ? "navy"
      : "red";

  const teamName =
    team === "navy"
      ? "Team Navy"
      : "Team Red";

  const pointsEarned =
    team === "navy"
      ? match.navyPoints
      : match.redPoints;

  const hasScores = Boolean(
    match.frontNine ||
      match.backNine ||
      match.totalScore,
  );

  return (
    <article
      className={[
        "group overflow-hidden border bg-[#081827]",
        "shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
        "transition duration-300 hover:-translate-y-1",
        team === "navy"
          ? "border-sky-300/20 hover:border-sky-300/40"
          : "border-red-300/20 hover:border-red-300/40",
      ].join(" ")}
    >
      {pointsEarned > 0 && (
        <div
          className={[
            "border-b px-5 py-3 text-center",
            "text-[10px] font-bold uppercase tracking-[0.24em]",
            team === "navy"
              ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
              : "border-red-300/20 bg-red-300/10 text-red-200",
          ].join(" ")}
        >
          +{formatPoints(
            pointsEarned,
          )}{" "}
          points earned
        </div>
      )}

      <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-6 sm:px-6">
        <div className="flex items-center gap-5">
          <TeamCrest
            team={team}
            className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
            imageClassName="h-full w-full object-contain"
          />

          <div>
            <p
              className={[
                "text-[10px] font-bold uppercase tracking-[0.22em]",
                team === "navy"
                  ? "text-sky-200"
                  : "text-red-200",
              ].join(" ")}
            >
              {teamName}
            </p>

            <h3 className="mt-2 font-serif text-3xl text-white">
              Scramble Score
            </h3>

            {(match.teeGroup ||
              match.startTime) && (
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-300">
                {[
                  match.teeGroup,
                  match.startTime,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>

        <StatusBadge
          status={match.status}
        />
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/10">
        <ScoreCell
          label="Front 9"
          value={match.frontNine}
        />

        <ScoreCell
          label="Back 9"
          value={match.backNine}
        />

        <ScoreCell
          label="Total"
          value={match.totalScore}
          featured
        />
      </div>

      {!hasScores &&
        match.status ===
          "upcoming" && (
          <div className="border-t border-white/10 px-6 py-4 text-center">
            <p className="text-xs leading-6 text-slate-400">
              Scores will appear
              here after each nine
              is completed.
            </p>
          </div>
        )}

      {match.result && (
        <div className="border-t border-white/10 bg-white/[0.025] px-6 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
            {match.result}
          </p>
        </div>
      )}
    </article>
  );
}

function ScoreCell({
  label,
  value,
  featured = false,
}: {
  label: string;
  value?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "flex min-h-36 flex-col items-center justify-center px-3 py-7 text-center",
        featured
          ? "bg-amber-300/[0.055]"
          : "",
      ].join(" ")}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>

      <p
        className={[
          "mt-4 font-serif",
          featured
            ? "text-5xl text-amber-200"
            : "text-4xl text-white",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
    </div>
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