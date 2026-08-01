import TeamCrest from "../common/TeamCrest";

import type {
  LiveMatch,
  LiveParticipant,
} from "../../data/live";

interface LiveMatchCardProps {
  match: LiveMatch;
}

const statusStyles = {
  upcoming:
    "border-slate-400/25 bg-slate-300/[0.07] text-slate-200",
  live:
    "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  complete:
    "border-amber-300/35 bg-amber-300/10 text-amber-200",
};

const statusLabels = {
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

function formatTypeLabel(
  format: string,
): string {
  if (
    format === "fourball" ||
    format === "four-ball"
  ) {
    return "Four-ball";
  }

  if (
    format === "drinking-game" ||
    format === "drinking-games"
  ) {
    return "Evening event";
  }

  return format
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function getCenterScore(
  match: LiveMatch,
): string {
  if (match.status === "complete") {
    return (
      match.displayScore ??
      match.result ??
      "Final"
    );
  }

  if (match.status === "live") {
    return (
      match.displayScore ??
      "All Square"
    );
  }

  return "vs";
}

function getWinnerLabel(
  match: LiveMatch,
): string | undefined {
  if (match.status !== "complete") {
    return undefined;
  }

  if (match.winnerTeam === "navy") {
    return "Team Navy wins";
  }

  if (match.winnerTeam === "red") {
    return "Team Red wins";
  }

  if (match.winnerTeam === "tie") {
    return "Match halved";
  }

  return undefined;
}

export default function LiveMatchCard({
  match,
}: LiveMatchCardProps) {
  if (match.sessionId === "scramble") {
    return (
      <ScrambleScoreCard
        match={match}
      />
    );
  }

  return (
    <StandardMatchCard
      match={match}
    />
  );
}

function ScrambleScoreCard({
  match,
}: LiveMatchCardProps) {
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

  const hasNineHoleScores =
    Boolean(
      match.frontNine ||
        match.backNine ||
        match.totalScore,
    );

  return (
    <article
      className={[
        "group overflow-hidden border",
        "bg-[#081827]",
        "shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
        "transition duration-300",
        "hover:-translate-y-1",
        team === "navy"
          ? "border-sky-300/20 hover:border-sky-300/35"
          : "border-red-300/20 hover:border-red-300/35",
      ].join(" ")}
    >
      {pointsEarned > 0 && (
        <div
          className={[
            "border-b px-5 py-3 text-center",
            "text-[10px] font-bold uppercase",
            "tracking-[0.24em]",
            team === "navy"
              ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
              : "border-red-300/20 bg-red-300/10 text-red-200",
          ].join(" ")}
        >
          +{formatPoints(
            pointsEarned,
          )} points earned
        </div>
      )}

      <div className="flex items-start justify-between gap-5 border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-5">
          <TeamCrest
            team={team}
            className="h-20 w-20 shrink-0"
            imageClassName="h-full w-full object-contain"
          />

          <div>
            <p
              className={[
                "text-[10px] font-bold uppercase",
                "tracking-[0.22em]",
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
        <ScrambleScore
          label="Front 9"
          value={match.frontNine}
        />

        <ScrambleScore
          label="Back 9"
          value={match.backNine}
        />

        <ScrambleScore
          label="Total"
          value={match.totalScore}
          featured
        />
      </div>

      {!hasNineHoleScores &&
        match.status === "upcoming" && (
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-center text-xs leading-6 text-slate-400">
              Scores will appear here
              once the team completes
              each nine.
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

function ScrambleScore({
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
        "flex min-h-36 flex-col",
        "items-center justify-center",
        "px-4 py-7 text-center",
        featured
          ? "bg-amber-300/[0.055]"
          : "",
      ].join(" ")}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
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

function StandardMatchCard({
  match,
}: LiveMatchCardProps) {
  const centerScore =
    getCenterScore(match);

  const winnerLabel =
    getWinnerLabel(match);

  const isEveningEvent =
    match.sessionId ===
    "evening-events";

  return (
    <article
      className={[
        "group relative overflow-hidden",
        "border border-white/10",
        "bg-[#081827]",
        "shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
        "transition duration-300",
        "hover:-translate-y-1",
        "hover:border-white/20",
      ].join(" ")}
    >
      {winnerLabel && (
        <div
          className={[
            "border-b px-5 py-3 text-center",
            "text-[10px] font-bold uppercase",
            "tracking-[0.24em]",
            match.winnerTeam === "navy"
              ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
              : match.winnerTeam === "red"
                ? "border-red-300/20 bg-red-300/10 text-red-200"
                : "border-amber-300/20 bg-amber-300/10 text-amber-200",
          ].join(" ")}
        >
          {winnerLabel}
        </div>
      )}

      <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
            {isEveningEvent
              ? `Event ${match.matchNumber}`
              : `Match ${match.matchNumber}`}
          </p>

          <h3 className="mt-2 font-serif text-2xl text-white">
            {match.eventName}
          </h3>

          {(match.teeGroup ||
            match.startTime) && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {match.teeGroup && (
                <span>
                  {match.teeGroup}
                </span>
              )}

              {match.startTime && (
                <span>
                  {match.startTime}
                </span>
              )}
            </div>
          )}
        </div>

        <StatusBadge
          status={match.status}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 py-8 sm:gap-6 sm:px-6">
        <TeamSide
          team="navy"
          fullTeam={
            match.navyFullTeam
          }
          participants={
            match.navyParticipants
          }
        />

        <div className="min-w-[76px] text-center sm:min-w-[112px]">
          <p className="font-serif text-xl leading-tight text-amber-200 sm:text-2xl">
            {centerScore}
          </p>

          {match.currentHole &&
            match.status === "live" && (
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                Through{" "}
                {match.currentHole}
              </p>
            )}

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

        <TeamSide
          team="red"
          fullTeam={
            match.redFullTeam
          }
          participants={
            match.redParticipants
          }
          align="right"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 bg-white/[0.025] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          {formatTypeLabel(
            match.format,
          )}
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
  status:
    | "upcoming"
    | "live"
    | "complete";
}) {
  return (
    <span
      className={[
        "shrink-0 border px-3 py-1.5",
        "text-[10px] font-bold uppercase",
        "tracking-[0.18em]",
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

function TeamSide({
  team,
  fullTeam,
  participants,
  align = "left",
}: {
  team: "navy" | "red";
  fullTeam: boolean;
  participants: LiveParticipant[];
  align?: "left" | "right";
}) {
  const isRight =
    align === "right";

  const teamLabel =
    team === "navy"
      ? "Team Navy"
      : "Team Red";

  const teamColor =
    team === "navy"
      ? "text-sky-200"
      : "text-red-200";

  if (fullTeam) {
    return (
      <div
        className={
          isRight
            ? "text-right"
            : ""
        }
      >
        <TeamCrest
          team={team}
          className={[
            "mb-3 h-20 w-20",
            isRight
              ? "ml-auto"
              : "",
          ].join(" ")}
          imageClassName="h-full w-full object-contain"
        />

        <p
          className={[
            "text-[10px] font-bold uppercase",
            "tracking-[0.2em]",
            teamColor,
          ].join(" ")}
        >
          {teamLabel}
        </p>

        <p className="mt-2 font-serif text-xl text-white">
          Full Team
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "min-w-0",
        isRight
          ? "text-right"
          : "",
      ].join(" ")}
    >
      <p
        className={[
          "mb-4 text-[10px] font-bold uppercase",
          "tracking-[0.2em]",
          teamColor,
        ].join(" ")}
      >
        {teamLabel}
      </p>

      <div className="space-y-4">
        {participants.map(
          (participant) => (
            <Participant
              key={participant.id}
              participant={
                participant
              }
              align={align}
            />
          ),
        )}
      </div>
    </div>
  );
}

function Participant({
  participant,
  align,
}: {
  participant: LiveParticipant;
  align: "left" | "right";
}) {
  const initials =
    participant.displayName
      .split(" ")
      .map((part) =>
        part.charAt(0),
      )
      .slice(0, 2)
      .join("");

  return (
    <div
      className={[
        "flex items-center gap-3",
        align === "right"
          ? "flex-row-reverse"
          : "",
      ].join(" ")}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.05]">
        {participant.photoPath ? (
          <img
            src={participant.photoPath}
            alt={
              participant.displayName
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-sm text-white">
            {initials}
          </div>
        )}
      </div>

      <p className="min-w-0 font-serif text-base leading-tight text-white sm:text-lg">
        {participant.displayName}
      </p>
    </div>
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
        "text-[9px] font-bold uppercase",
        "tracking-[0.14em]",
        team === "navy"
          ? "border-sky-300/25 bg-sky-300/10 text-sky-200"
          : "border-red-300/25 bg-red-300/10 text-red-200",
      ].join(" ")}
    >
      +{formatPoints(points)}
    </span>
  );
}